"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Zap, Settings2, Share2, Box } from "lucide-react";

export default function RuleModal({ isOpen, onClose, onSave, initialData, clientId, client_Id }) {
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors }, setError, clearErrors, } = useForm({
    defaultValues: initialData || {
      ruleName: "",
      triggerType: "keyword",
      keywords: "",
      buttonId: "",
      actions: [],
      actionConfig: { sheetId: "", sheetName: "Sheet1" },
      mediaType: "none",
      mediaFile: "",
      responseType: "text",
      responseText: "",
      buttons: [],
      menuTitle: "Select an Option",
      menuItems: [], // For the "List/Menu" type
      mediaUrl: ""
    }
  });
  console.log("In rule modal", initialData);

  // Manage Buttons
  const { fields: btnFields, append: appendBtn, remove: removeBtn } = useFieldArray({
    control, name: "buttons"
  });

  // Manage Menu Items
  const { fields: menuFields, append: appendMenu, remove: removeMenu } = useFieldArray({
    control, name: "menuItems"
  });


  // 1. Create a "Live" preview state
  const [previewUrl, setPreviewUrl] = useState(initialData?.mediaUrl || null);

  // 2. Watch for file changes and update the preview instantly
  const selectedFile = watch("mediaFile");

  useEffect(() => {
    if (selectedFile?.[0]) {
      // If user picks a NEW file, create a temporary local link for the preview
      const localUrl = URL.createObjectURL(selectedFile[0]);
      setPreviewUrl(localUrl);

      // Cleanup memory when component unmounts
      return () => URL.revokeObjectURL(localUrl);
    } else {
      // If no new file, stay with the initial cloud image
      setPreviewUrl(initialData?.mediaUrl || null);
    }
  }, [selectedFile, initialData]);

  const removeMedia = () => {
    // 1. Clear the file input
    setValue("mediaFile", null);

    // 2. Clear the existing URL (This tells the backend to DELETE)
    setValue("mediaUrl", "");

    // 3. Reset the selection to "None"
    setValue("mediaType", "none");

    // 4. Reset our local preview state
    setPreviewUrl(null);
  };

  const triggerType = watch("triggerType");
  const responseType = watch("responseType");
  const selectedActions = watch("actions") || [];
  // const mediaType = watch("mediaType"); 



  useEffect(() => {
    if (initialData) reset(initialData);
    if (initialData?.mediaUrl) {
      setPreviewUrl(initialData?.mediaUrl);
      setValue("mediaType", initialData?.mediaType || "image");
    } else {
      // If editing a rule with no media, ensure it's set to none
      setPreviewUrl(null);
      setValue("mediaType", "none");
    }
  }, [initialData, reset, setValue]);

  const handleActionChange = (actionId, checked) => {
    const current = [...selectedActions];
    setValue("actions", checked ? [...current, actionId] : current.filter(id => id !== actionId));
  };

  const onSubmit = (data) => {
    // 1. Fresh start for every submit click
    clearErrors(["buttons", "menuItems"]);
    let hasError = false;

    // 2. Strict Button Check (as we did before)
    if (data.responseType === "buttons") {
      if (!data.buttons || data.buttons.length === 0) {
        setError("buttons", { type: "manual", message: "Please add at least one button!" });
        hasError = true;
      } else if (data.buttons.some(btn => !btn.title?.trim() || !btn.id?.trim())) {
        setError("buttons", { type: "manual", message: "All buttons need a Label and an Action ID!" });
        hasError = true;
      }
    }

    // 3. Strict Menu Check 🟢
    if (data.responseType === "menu") {

      if (!data.menuItems || data.menuItems.length === 0) {
        setError("menuItems", { type: "manual", message: "Please add at least one menu item!" });
        hasError = true;
      } else if (data.menuItems.some(item => !item.title?.trim() || !item.id?.trim())) {
        setError("menuItems", { type: "manual", message: "All menu items need a Label and an Action ID!" });
        hasError = true;
      }
    }
    // 4. STOP if validation failed
    if (hasError) return;
    const formData = new FormData();

    //  Add the File (if the user selected one and mediaType isn't 'none')
    if (data.mediaType !== "none" && data.mediaFile && data.mediaFile[0]) {
      formData.append("file", data.mediaFile[0]);
    }

    // Create a copy of the data
    let cleanedData = { ...data };

    // Clear out fields that don't belong to the selected trigger
    if (data.triggerType === "keyword") {
      cleanedData.buttonId = ""; // Clear button ID if it's a keyword rule
    } else if (data.triggerType === "button_click") {
      cleanedData.keywords = ""; // Clear keywords if it's a button rule
    } else if (data.triggerType === "welcome" || data.triggerType === "fallback") {
      cleanedData.keywords = "";
      cleanedData.buttonId = "";
    }

    // 3. Do the same for Response Type (Optional but recommended)
    if (data.responseType === "text") {
      cleanedData.buttons = [];
      cleanedData.menuItems = [];
      cleanedData.menuTitle = "";
    } else if (data.responseType === "buttons") {
      cleanedData.menuItems = [];
      cleanedData.menuTitle = "";
    } else if (data.responseType === "menu") {
      cleanedData.buttons = [];
    }

    //Pack the rest of the rule as a JSON string
    formData.append("ruleData", JSON.stringify({
      ...cleanedData,
      clientId,
      client_Id,
      _id: initialData?._id
    }));
    // onSave({ ...cleanedData, clientId, client_Id, _id: initialData?._id });
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl flex items-center gap-2 font-bold">
            <Settings2 className="w-5 h-5 text-green-600" />
            {initialData ? "Edit Automation" : "New Automation Rule"}

          </DialogTitle>
          <p className="text-slate-400 text-sm mt-1">Set up a smart reply for your customers in less than a minute.</p>


        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">

          {/* INTERNAL NAME */}
          <div className="space-y-1">
            <label className="text-[15px] font-medium  text-black">Step Name (just for your reference)</label>
            <Input placeholder="e.g., Welcome Message" {...register("ruleName", { required: true })} />
          </div>

          {/* TRIGGER CONFIG */}

          <div>
            Step-1
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {/* Header with clear intent */}
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-amber-600 fill-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">When should this reply run?</h3>
                <p className="text-xs text-slate-500">Choose when the bot should jump into the conversation.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Select onValueChange={(v) => setValue("triggerType", v)} defaultValue={triggerType}>
                <SelectTrigger className="bg-white w-full h-12 border-slate-200  focus:ring-green-500">
                  <SelectValue placeholder="Select a trigger..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="keyword">💬 When a user sends a specific message</SelectItem>
                  <SelectItem value="button_click">🔘 When a user clicks a button or menu</SelectItem>
                  <SelectItem value="welcome">👋 When someone messages for the first time</SelectItem>
                  <SelectItem value="fallback">🆘 If the bot doesn't understand anything else</SelectItem>
                </SelectContent>
              </Select>

              {/* DYNAMIC GUIDANCE TEXT */}
              <div className="px-1">
                <h4 className="text-sm font-semibold text-slate-700">
                  {triggerType === "keyword" && "Which words should trigger this reply?"}
                  {triggerType === "button_click" && "Which button ID should trigger this?"}
                  {triggerType === "welcome" && "Welcome Message Settings"}
                  {triggerType === "fallback" && "Backup Plan (Fallback)"}
                </h4>

                <p className="text-xs text-slate-400 mt-0.5">
                  {triggerType === "keyword" && "If the customer's message contains any of these, the bot replies."}
                  {triggerType === "button_click" && "Enter the Payload ID you gave to your button earlier."}
                  {triggerType === "welcome" && "This is the very first message a new customer will see."}
                  {triggerType === "fallback" && "This keeps the conversation going when the bot is confused."}
                </p>
              </div>

              {/* CONDITIONAL INPUTS */}
              {triggerType === "keyword" && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <Input
                    placeholder="e.g. price, location, timings, help"
                    {...register("keywords")}
                    className="bg-white h-11  border-slate-200 focus:border-green-500 focus:ring-green-500 shadow-sm"
                  />
                  <p className="text-[12px] text-slate-600 mt-2 flex items-center gap-1 italic">
                    💡  Use commas to separate multiple words.
                  </p>
                </div>
              )}

              {triggerType === "button_click" && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <Input
                    placeholder="Enter Button ID (e.g. main_menu_btn)"
                    {...register("buttonId")}
                    className="bg-white h-11 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ACTIONS (SHADCN CHECKBOX) */}
          {/* <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400">Actions</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                // { id: "shopify_lookup", label: "Shopify Sync", icon: Box },
                { id: "log_to_sheet", label: "Log Lead", icon: Share2 },
                { id: "switch_to_human", label: "Agent Handover", icon: Plus }
              ].map((act) => (
                <div key={act.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${selectedActions.includes(act.id) ? "bg-green-50 border-green-500" : "bg-white"}`}>
                  <Checkbox id={act.id} checked={selectedActions.includes(act.id)} onCheckedChange={(c) => handleActionChange(act.id, c)} />
                  <label htmlFor={act.id} className="text-sm font-bold cursor-pointer">{act.label}</label>
                </div>
              ))}
            </div>
          </div> */}

          {/* MEDIA SELECTION */}
          {/* <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">Media Header</h3>
              </div>

              <Select
                onValueChange={(v) => setValue("mediaType", v)}
                defaultValue={watch("mediaType") || "none"}
              >
                <SelectTrigger className="w-[150px] bg-white h-8 text-xs">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Media</SelectItem>
                  <SelectItem value="image">Image (JPG/PNG)</SelectItem>
                  <SelectItem value="document">Document (PDF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CONDITIONAL UPLOAD BOX */}
          {/* {watch("mediaType") !== "none" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-black uppercase text-indigo-500">
                  Upload {watch("mediaType") === "image" ? "Image" : "PDF"}
                </label>
                <Input
                  type="file"
                  {...register("mediaFile")}
                  accept={watch("mediaType") === "image" ? "image/*" : "application/pdf"}
                  className="bg-white cursor-pointer border-indigo-200 focus:ring-indigo-500"
                />
                <p className="text-[9px] text-slate-400">
                  * This file will be uploaded to the server when you click <b>Save Automation</b>.
                </p>
              </div>
            )} */}
          {/* </div> */}

          {/* RESPONSE BUILDER -THE REPLY CONTENT*/}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                <h3 className="font-bold text-slate-800 text-lg">What should the bot send?</h3>
              </div>
              {/* <label className="text-[10px] font-black uppercase text-slate-400">Bot Response</label> */}
              <Select onValueChange={(v) => setValue("responseType", v)} defaultValue={responseType}>
                <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Select response type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Only</SelectItem>
                  <SelectItem value="buttons">Text + Buttons (Max 3)</SelectItem>
                  <SelectItem value="menu">Text + Menu List (Max 10)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {responseType !== "none" && (

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">
                    Bot Message <span className="text-red-500">*</span>
                  </label>
                  {errors.responseText && (
                    <span className="text-[10px] font-bold text-red-500 animate-pulse">
                      Message is required!
                    </span>
                  )}
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded uppercase">
                    WhatsApp Format Supported
                  </span>
                </div>

                <div className="relative group">
                  <textarea
                    className={`w-full min-h-[120px] p-4 rounded-2xl border-2 bg-white text-sm outline-none transition-all resize-none shadow-sm
      ${errors.responseText
                        ? "border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                      }`}
                    placeholder="Type the message your customers will see..."
                    {...register("responseText", {
                      required: "Please enter a reply message",
                      minLength: { value: 2, message: "Message is too short" }
                    })}
                  />
                  <p className="text-[10px] text-slate-400 ml-1">
                    * This is the text your bot will send back to the user.
                  </p>

                  {/* Helper Hint for Variables */}
                  {/* <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <p className="text-[10px] text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100">
        Tip: Use <b>{"{{name}}"}</b> to greet the customer personally
      </p>
    </div> */}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("responseText", watch("responseText") + " *bold* ")}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-slate-200 px-2 py-1 rounded bg-slate-50"
                  >
                    <b>B</b> Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("responseText", watch("responseText") + " _italic_ ")}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-slate-200 px-2 py-1 rounded bg-slate-50"
                  >
                    <i>I</i> Italic
                  </button>
                </div>
              </div>
            )}



            {/* BUTTONS BUILDER */}
            {responseType === "buttons" && (
              <div className="mt-4 p-5 bg-blue-50/30 rounded-2xl border-2 border-blue-50 space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Interactive Buttons</p>
                    <p className="text-[11px] text-slate-400">Add up to 3 clickable buttons for your message.</p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {btnFields.length}/3 Used
                  </span>
                </div>

                <div className="space-y-3">
                  {btnFields.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-start animate-in zoom-in-95 duration-200">
                      <div className="flex-1 grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Button Text</label>
                          <Input
                            placeholder="e.g. Buy Now"
                            {...register(`buttons.${index}.title`)} // Clean and simple
                            className="h-8 border-none p-0 text-sm font-semibold focus-visible:ring-0"
                          />
                        </div>
                        <div className="space-y-1 border-l pl-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Action ID</label>
                          <Input
                            placeholder="e.g. order_01"
                            {...register(`buttons.${index}.id`)}
                            className="h-8 border-none p-0 text-sm text-blue-500 font-mono focus-visible:ring-0"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-2 hover:bg-red-50 hover:text-red-500 text-slate-300"
                        onClick={() => removeBtn(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {/* SHOW ERROR HERE IF ARRAY IS EMPTY */}
                  {errors.buttons && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-1">
                      <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                        ❌ {errors.buttons.message}
                      </p>
                    </div>
                  )}

                  {btnFields.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-dashed border-blue-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-400 rounded-xl transition-all"
                      onClick={() => appendBtn({ title: "", id: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add a Clickable Button
                    </Button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 italic text-center">
                  Note: Buttons make it 3x more likely for customers to reply!
                </p>
              </div>
            )}



            {/* MENU/LIST BUILDER */}
            {responseType === "menu" && (
              <div className="space-y-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in zoom-in-95 duration-200">
                <div>
                  <label className="text-xs font-bold text-indigo-600 uppercase ml-1">Menu Button Text</label>
                  <Input
                    placeholder="e.g. 📋 View Our Services"
                    {...register("menuTitle")}
                    className="bg-white mt-1 h-11 rounded-xl border-indigo-200 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 ml-1">This is the button customers click to see your list.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">List Items (Max 10)</label>

                  {menuFields.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-start group animate-in slide-in-from-left-2">
                      <div className="flex-1 space-y-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        {/* Inside your menuFields.map */}
                        <Input
                          placeholder="Item Name (e.g. Laptop Repair)"
                          {...register(`menuItems.${index}.title`)}
                          className="border-none p-0 h-6 text-sm font-semibold focus-visible:ring-0"
                        />
                        <Input
                          placeholder="Short ID (e.g. repair_01)"
                          {...register(`menuItems.${index}.id`)}
                          className="border-none p-0 h-4 text-[10px] text-indigo-400 focus-visible:ring-0 font-mono"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-2 hover:bg-red-50"
                        onClick={() => removeMenu(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  ))}

                  {errors.menuItems && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-1">
                      <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                        ❌ {errors.menuItems.message}
                      </p>
                    </div>
                  )}

                  {menuFields.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 border-dashed border-indigo-300 text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl"
                      onClick={() => appendMenu({ title: "", id: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add another option to the list
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>


          {/* MEDIA SELECTION */}
          <div className="space-y-4 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100 shadow-sm transition-all">


            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Header Preview</label>
              {/* THE REMOVE BUTTON */}
              {/* ONLY show this button if there is actually something to remove */}
              {previewUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={removeMedia}
                  className="h-6 px-2 text-[10px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md gap-1 animate-in fade-in duration-200"
                >
                  <Trash2 className="w-3 h-3" /> Remove Media
                </Button>
              )}

            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Add a Visual Header</h3>
                  <p className="text-[11px] text-slate-500">Make your message stand out with an image or PDF.</p>
                </div>
              </div>

              <Select
                // Use value instead of defaultValue to make it reactive
                value={watch("mediaType")}
                onValueChange={(v) => {
                  setValue("mediaType", v);
                  // If user switches to "none", we trigger our cleanup logic
                  if (v === "none") removeMedia();
                }}
              >
                <SelectTrigger className="w-[130px] bg-white h-9 rounded-xl border-indigo-200 text-xs font-semibold">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">❌ No Media</SelectItem>
                  <SelectItem value="image">🖼️ Image</SelectItem>
                  <SelectItem value="pdf">📄 PDF / Doc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CONDITIONAL UPLOAD BOX */}
            {(watch("mediaType") === "image" || watch("mediaType") === "pdf") && (


              <div className="space-y-4 p-4 bg-white rounded-2xl border-2 border-indigo-50 shadow-sm animate-in fade-in duration-300">

                {/* THE DYNAMIC PREVIEW CARD */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-slate-400">Header Preview</label>
                    {selectedFile?.[0] ? (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        New Selection (Not Saved Yet)
                      </span>
                    ) : initialData?.mediaUrl ? (
                      <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        Live from Cloud ✅
                      </span>
                    ) : null}
                  </div>

                  {/* Actual Image/File Container */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-slate-50 flex items-center justify-center">
                    {previewUrl ? (
                      watch("mediaType") === "image" ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Box className="w-10 h-10 text-indigo-400" />
                          <span className="text-xs font-bold text-slate-500">PDF Document Ready</span>
                        </div>
                      )
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center gap-2">
                        <Share2 className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-medium italic">No file selected yet</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* THE UPLOAD BUTTON */}
                <div className="relative group">
                  <Input
                    type="file"
                    {...register("mediaFile", {
                      validate: (value) => {
                        const type = watch("mediaType");
                        // If user selected Image/Document but there is NO preview and NO file
                        if (type !== "none" && !previewUrl && (!value || value.length === 0)) {
                          return "Please upload a file for your header";
                        }
                        return true;
                      }
                    })}
                    accept={watch("mediaType") === "image" ? "image/*" : "application/pdf"}
                    className="bg-slate-50 cursor-pointer border-dashed border-2 border-indigo-200 h-14 pt-4 pb-8 file:hidden text-center text-xs text-slate-500 hover:bg-indigo-50 hover:border-indigo-400 transition-all rounded-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-2">
                    <Plus className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-600">
                      {previewUrl ? "Change File" : "Upload File"}
                    </span>
                  </div>
                </div>
                {/* 🟢 ADD THIS ERROR BLOCK HERE */}
                {errors.mediaFile && (
                  <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center justify-center gap-1 animate-pulse">
                    ❌ {errors.mediaFile.message}
                  </p>
                )}
              </div>


            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="text-center text-[11px] font-bold text-red-500 mb-2 animate-bounce">
              ⚠️ Please fill in all mandatory fields before saving.
            </p>
          )}

          <DialogFooter className="sticky bottom-0 bg-white pt-4">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-11 rounded-xl text-lg font-bold" onClick={() => clearErrors(["buttons", "menuItems"])}>Save Automation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );






}
