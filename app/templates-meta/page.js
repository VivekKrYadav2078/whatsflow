// "use client";
// import React, { useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Plus, Trash2, Smartphone, Save, AlertCircle } from "lucide-react";

// //  Zod Schema for strict Meta validation
// const schema = z.object({
//   name: z.string().min(1, "Name is required").regex(/^[a-z0-9_]+$/, "Use lowercase, numbers, and underscores only"),
//   category: z.enum(["MARKETING", "UTILITY"]),
//   language: z.string().default("en_US"),
//   bodyText: z.string().min(1, "Body is required").max(1024),
//   samples: z.array(z.string().min(1, "Sample required")),
//   buttons: z.array(z.object({
//     type: z.enum(["QUICK_REPLY", "URL", "PHONE_NUMBER"]),
//     text: z.string().max(25, "Max 25 chars"),
//     url: z.string().optional(),
//     phone: z.string().optional()
//   })).max(10)
// });

// export default function RefactoredTemplateCreator() {
//   const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       name: "", category: "MARKETING", language: "en_US", bodyText: "", samples: [], buttons: []
//     }
//   });

//   const { fields: buttonFields, append: appendButton, remove: removeButton } = useFieldArray({ control, name: "buttons" });
//   const { fields: sampleFields, replace: replaceSamples } = useFieldArray({ control, name: "samples" });

//   const watchedBody = watch("bodyText");
//   const watchedButtons = watch("buttons");

//   // Auto-detect variables {{1}}, {{2}} and sync samples array
//   useEffect(() => {
//     const variables = watchedBody.match(/{{(\d+)}}/g) || [];
//     const currentSamples = variables.map((_, i) => ""); // Empty placeholders
//     replaceSamples(currentSamples);
//   }, [watchedBody, replaceSamples]);

//   const onSubmit = async (data) => {
//     console.log("Structured Meta Payload:", data);
//     // Here you would hit your /api/templates/create endpoint
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-50 min-h-screen">
//       {/* 🛠️ EDITOR SECTION */}
//       <div className="flex-1 space-y-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-xl font-bold mb-4">Meta Template Details</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <input {...register("name")} placeholder="template_name" className="w-full p-2 border rounded text-sm" />
//               {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//             </div>
//             <select {...register("category")} className="p-2 border rounded text-sm">
//               <option value="MARKETING">Marketing</option>
//               <option value="UTILITY">Utility</option>
//             </select>
//           </div>
//         </div>

//         {/* BODY EDITOR */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <label className="font-bold text-sm block mb-2">Message Body</label>
//           <textarea 
//             {...register("bodyText")}
//             rows="5"
//             placeholder="Hello {{1}}, your code is {{2}}"
//             className="w-full p-3 border rounded-lg text-sm"
//           />
          
//           {/* DYNAMIC SAMPLES FOR VARIABLES */}
//           {sampleFields.length > 0 && (
//             <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
//               <p className="text-xs font-bold text-blue-700 mb-2 flex items-center">
//                 <AlertCircle className="w-3 h-3 mr-1" /> Variable Samples (Required)
//               </p>
//               <div className="space-y-2">
//                 {sampleFields.map((field, index) => (
//                   <input 
//                     key={field.id}
//                     {...register(`samples.${index}`)}
//                     placeholder={`Sample for {{${index + 1}}}`}
//                     className="w-full p-2 text-xs border rounded bg-white"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* DYNAMIC BUTTONS */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex justify-between items-center mb-4">
//             <label className="font-bold text-sm">Buttons (Max 10)</label>
//             <button 
//               type="button"
//               onClick={() => appendButton({ type: "QUICK_REPLY", text: "" })}
//               className="text-xs text-blue-600 font-bold"
//             >+ Add Quick Reply</button>
//           </div>
//           {buttonFields.map((field, index) => (
//             <div key={field.id} className="flex gap-2 mb-2 items-center">
//               <input {...register(`buttons.${index}.text`)} placeholder="Button Text" className="flex-1 p-2 border rounded text-sm" />
//               <button type="button" onClick={() => removeButton(index)}><Trash2 className="w-4 h-4 text-red-400" /></button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 📱 LIVE PREVIEW */}
//       <div className="w-full lg:w-80">
//         <div className="sticky top-8">
//           <div className="w-full h-[550px] bg-[#e5ddd5] rounded-[2.5rem] border-[8px] border-gray-900 overflow-hidden shadow-2xl relative">
//             <div className="bg-[#075e54] h-14 flex items-center px-4 text-white text-xs gap-3">
//               <div className="w-8 h-8 bg-gray-400 rounded-full" />
//               <span>Nedrix Preview</span>
//             </div>
//             <div className="p-4">
//               <div className="bg-white p-3 rounded-lg shadow-sm">
//                 <p className="text-[13px] whitespace-pre-wrap">{watchedBody || "Start typing..."}</p>
//               </div>
//               <div className="mt-2 space-y-1">
//                 {watchedButtons?.map((btn, i) => (
//                   <div key={i} className="bg-white py-2 text-center rounded-lg shadow-sm text-blue-500 text-sm border-t border-gray-100">
//                     {btn.text || `Button ${i+1}`}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <button type="submit" className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
//             <Save className="w-5 h-5" /> Submit to Meta
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }


// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { Plus, Trash2, Smartphone, Save, Image as ImageIcon, X, FileText, Film } from "lucide-react";

// export default function ProfessionalTemplateCreator() {
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const { register, control, handleSubmit, watch, setValue, reset } = useForm({
//     defaultValues: {
//       name: "",
//       category: "MARKETING",
//       headerType: "IMAGE", // Defaulting to Image for that pro look
//       bodyText: "",
//       buttons: []
//     }
//   });

//   const { fields, append, remove } = useFieldArray({ control, name: "buttons" });
//   const watchedValues = watch();

//   // 🔄 Sync Draft to LocalStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("nedrix_draft");
//     if (saved) reset(JSON.parse(saved));
//   }, [reset]);

//   useEffect(() => {
//     localStorage.setItem("nedrix_draft", JSON.stringify(watchedValues));
//   }, [watchedValues]);

//   // 🖼️ Media Handling
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setValue("headerFile", file); // Save file object for upload later
//     }
//   };

//   const removeMedia = () => {
//     setPreviewUrl(null);
//     setValue("headerFile", null);
//   };

//   const onSubmit = async (data) => {
//     console.log("Submitting Structured Template:", data);
//     // 1. Upload file to Meta Resumable API -> Get Handle
//     // 2. Submit Template JSON to Meta
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-50 min-h-screen font-sans">
//       <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
//         {/* 1. TOP SETTINGS */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
//           <h2 className="text-lg font-bold text-gray-800">1. Template Settings</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <input 
//               {...register("name")} 
//               placeholder="template_name_lowercase" 
//               className="p-3 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" 
//             />
//             <select {...register("category")} className="p-3 border rounded-xl text-sm bg-white">
//               <option value="MARKETING">Marketing (Offers/Ads)</option>
//               <option value="UTILITY">Utility (Updates/OTPs)</option>
//             </select>
//           </div>
//         </div>

//         {/* 2. MEDIA HEADER */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-bold text-gray-800">2. Media Header</h2>
//             <div className="flex bg-gray-100 p-1 rounded-lg">
//               {["IMAGE", "VIDEO", "DOCUMENT"].map((t) => (
//                 <button 
//                   key={t}
//                   type="button"
//                   onClick={() => setValue("headerType", t)}
//                   className={`px-3 py-1 text-xs rounded-md transition ${watchedValues.headerType === t ? 'bg-white shadow-sm font-bold' : 'text-gray-500'}`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {!previewUrl ? (
//             <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center hover:bg-gray-50 transition cursor-pointer relative">
//               <input 
//                 type="file" 
//                 className="absolute inset-0 opacity-0 cursor-pointer" 
//                 onChange={handleFileChange}
//                 accept={watchedValues.headerType === "IMAGE" ? "image/*" : watchedValues.headerType === "VIDEO" ? "video/*" : ".pdf"}
//               />
//               <div className="bg-green-100 p-4 rounded-full mb-3">
//                 <Plus className="text-green-600" />
//               </div>
//               <p className="text-sm font-medium text-gray-600">Click to upload {watchedValues.headerType}</p>
//               <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 or PDF</p>
//             </div>
//           ) : (
//             <div className="relative rounded-2xl overflow-hidden border">
//               <div className="bg-gray-900/10 p-4 flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-700 uppercase">{watchedValues.headerType} Selected</span>
//                 <button onClick={removeMedia} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* 3. MESSAGE BODY */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
//           <h2 className="text-lg font-bold text-gray-800">3. Body Text</h2>
//           <textarea 
//             {...register("bodyText")} 
//             rows="5" 
//             placeholder="Write your professional message here..." 
//             className="w-full p-4 border rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none" 
//           />
//         </div>

//         {/* 4. BUTTONS */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-bold text-gray-800">4. Interactive Buttons</h2>
//             <button 
//               type="button" 
//               onClick={() => append({ type: "QUICK_REPLY", text: "" })}
//               className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-100 transition"
//             >
//               + Add Button
//             </button>
//           </div>
//           {fields.map((field, index) => (
//             <div key={field.id} className="flex gap-3">
//               <input 
//                 {...register(`buttons.${index}.text`)} 
//                 placeholder="Button Label (e.g. Chat with Us)" 
//                 className="flex-1 p-3 border rounded-xl text-sm" 
//               />
//               <button onClick={() => remove(index)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition">
//                 <Trash2 size={20} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </form>

//       {/* 📱 WHATSAPP SMART PREVIEW */}
//       <div className="w-full lg:w-[380px]">
//         <div className="sticky top-8">
//           <div className="w-full aspect-[9/18.5] bg-[#E5DDD5] rounded-[3rem] border-[12px] border-gray-900 overflow-hidden shadow-2xl relative">
//             {/* Header */}
//             <div className="bg-[#075E54] p-5 pt-10 text-white flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full" />
//               <div className="flex-1">
//                 <p className="font-bold text-sm">Nedrix Marketing</p>
//                 <p className="text-[10px] opacity-80">Online</p>
//               </div>
//             </div>

//             {/* Chat Area */}
//             <div className="p-4 space-y-2">
//               <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-[90%]">
//                 {/* 🖼️ Media Preview */}
//                 {previewUrl ? (
//                   watchedValues.headerType === "IMAGE" ? (
//                     <img src={previewUrl} className="w-full aspect-video object-cover" alt="Preview" />
//                   ) : watchedValues.headerType === "VIDEO" ? (
//                     <div className="w-full aspect-video bg-black flex items-center justify-center">
//                       <Film className="text-white opacity-50" size={40} />
//                     </div>
//                   ) : (
//                     <div className="w-full h-24 bg-gray-100 flex items-center justify-center border-b">
//                       <FileText className="text-gray-400" size={32} />
//                       <span className="text-xs text-gray-500 ml-2">PDF Document</span>
//                     </div>
//                   )
//                 ) : (
//                   <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-300">
//                     <ImageIcon size={48} />
//                   </div>
//                 )}

//                 {/* 📝 Text Preview */}
//                 <div className="p-3">
//                   <p className="text-[13px] leading-relaxed text-gray-800 whitespace-pre-wrap">
//                     {watchedValues.bodyText || "Your marketing message will appear here..."}
//                   </p>
//                   <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">10:42 AM</p>
//                 </div>
//               </div>

//               {/* 🔘 Button Preview */}
//               <div className="space-y-1 w-[90%]">
//                 {watchedValues.buttons?.map((btn, i) => (
//                   <div key={i} className="bg-white/90 backdrop-blur-sm py-2.5 text-center rounded-xl shadow-sm text-[#0080F8] text-sm font-semibold border-t border-gray-50 active:bg-gray-100 cursor-pointer">
//                     {btn.text || `Button ${i+1}`}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
          
//           <button 
//             type="submit"
//             onClick={handleSubmit(onSubmit)}
//             className="w-full mt-8 bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 shadow-xl transition-all active:scale-95"
//           >
//             <Save size={20} /> Submit for Approval
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Smartphone, Save, Image as ImageIcon, X, FileText, Film, Globe, Phone, MessageSquare, AlertCircle } from "lucide-react";

// 🛡️ Zod Schema for strict 2026 Meta Validation
const templateSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[a-z0-9_]+$/, "Lowercase, numbers & underscores only"),
  category: z.enum(["MARKETING", "UTILITY"]),
  headerType: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "NONE"]),
  bodyText: z.string().min(1, "Body text is required").max(1024),
  samples: z.array(z.string().min(1, "Sample required")),
  buttons: z.array(z.object({
    type: z.enum(["QUICK_REPLY", "URL", "PHONE_NUMBER"]),
    text: z.string().min(1).max(25, "Max 25 characters"),
    url: z.string().optional(),
    phone: z.string().optional(),
  })).max(10, "Meta allows max 10 buttons total")
});

export default function ProfessionalMMTemplateCreator() {
  const [previewUrl, setPreviewUrl] = useState(null);

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "", category: "MARKETING", headerType: "IMAGE", bodyText: "", samples: [], buttons: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "buttons" });
  const watched = watch();

  // 1. 💾 LocalStorage Persistence & Draft Loading
  useEffect(() => {
    const saved = localStorage.getItem("nedrix_template_draft");
    if (saved) reset(JSON.parse(saved));
  }, [reset]);

  useEffect(() => {
    localStorage.setItem("nedrix_template_draft", JSON.stringify(watched));
  }, [watched]);

  // 2. 🧠 Variable Detection {{n}}
  useEffect(() => {
    const vars = watched.bodyText.match(/{{(\d+)}}/g) || [];
    if (vars.length !== watched.samples.length) {
      setValue("samples", vars.map((_, i) => watched.samples[i] || ""));
    }
  }, [watched.bodyText, setValue, watched.samples]);

  // 3. 🖼️ Media Preview Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    console.log("🚀 Payload for MM API:", data);
    // 1. Upload media to get 'header_handle' 
    // 2. POST to /message_templates endpoint
    alert("Template structured for MM API! Check console for payload.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
        
        {/* --- SECTION 1: SETTINGS --- */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Save size={20}/> 1. Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <input {...register("name")} placeholder="promo_august_2026" className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400" />
              {errors.name && <p className="text-red-500 text-[10px] ml-1">{errors.name.message}</p>}
            </div>
            <select {...register("category")} className="p-3 border rounded-xl text-sm bg-white">
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utility</option>
            </select>
          </div>
        </div>

        {/* --- SECTION 2: MEDIA HEADER --- */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2"><ImageIcon size={20}/> 2. Media Header</h2>
            <select {...register("headerType")} className="text-xs bg-gray-100 p-2 rounded-lg font-bold outline-none" onChange={(e) => { setValue("headerType", e.target.value); setPreviewUrl(null); }}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="DOCUMENT">Document (PDF)</option>
              <option value="NONE">No Media</option>
            </select>
          </div>

          {watched.headerType !== "NONE" && !previewUrl && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center hover:bg-gray-50 cursor-pointer relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
              <Plus className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Upload {watched.headerType}</p>
            </div>
          )}

          {previewUrl && (
            <div className="relative group">
              <div className="p-3 border rounded-xl flex justify-between items-center bg-gray-50">
                <span className="text-xs font-bold text-gray-500">File Selected: {watched.headerType}</span>
                <button type="button" onClick={() => setPreviewUrl(null)} className="text-red-500"><X size={18}/></button>
              </div>
            </div>
          )}
        </div>

        {/* --- SECTION 3: BODY --- */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-lg font-bold">3. Message Body</h2>
          <textarea {...register("bodyText")} rows="5" placeholder="Hi {{1}}, get 20% off today!" className="w-full p-4 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-400" />
          
          {watched.samples.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-xl space-y-2 border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1"><AlertCircle size={12}/> Variable Samples (Required)</p>
              {watched.samples.map((_, i) => (
                <input key={i} {...register(`samples.${i}`)} placeholder={`Sample for {{${i+1}}}`} className="w-full p-2 text-xs border rounded-lg bg-white" />
              ))}
            </div>
          )}
        </div>

       {/* --- SECTION 4: BUTTONS (STRICT LIMITS) --- */}
<div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-lg font-bold">4. Buttons ({fields.length}/10)</h2>
      <p className="text-[10px] text-gray-400">Total limit: 10 buttons</p>
    </div>
    
    <div className="flex gap-2">
      {/* Quick Reply (Available if total < 10) */}
      <button 
        type="button" 
        disabled={fields.length >= 10}
        onClick={() => append({ type: "QUICK_REPLY", text: "" })} 
        className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        + Quick Reply
      </button>

      {/* URL Button (STRICT LIMIT: 2) */}
      <button 
        type="button" 
        disabled={fields.length >= 10 || watched.buttons.filter(b => b.type === "URL").length >= 2}
        onClick={() => append({ type: "URL", text: "", url: "" })} 
        className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        + URL ({watched.buttons.filter(b => b.type === "URL").length}/2)
      </button>

      {/* Call Button (STRICT LIMIT: 1) */}
      <button 
        type="button" 
        disabled={fields.length >= 10 || watched.buttons.filter(b => b.type === "PHONE_NUMBER").length >= 1}
        onClick={() => append({ type: "PHONE_NUMBER", text: "", phone: "" })} 
        className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        + Call ({watched.buttons.filter(b => b.type === "PHONE_NUMBER").length}/1)
      </button>
    </div>
  </div>

  <div className="space-y-3">
    {fields.map((field, index) => {
      const buttonType = watched.buttons[index]?.type;
      
      return (
        <div key={field.id} className="p-3 border rounded-xl bg-gray-50 relative animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
              {buttonType === "URL" && <Globe size={10} className="text-blue-500" />}
              {buttonType === "PHONE_NUMBER" && <Phone size={10} className="text-purple-500" />}
              {buttonType === "QUICK_REPLY" && <MessageSquare size={10} className="text-gray-400" />}
              {buttonType.replace("_", " ")}
            </span>
            <button type="button" onClick={() => remove(index)}>
              <Trash2 size={16} className="text-red-400 hover:text-red-600 transition" />
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input 
                {...register(`buttons.${index}.text`)} 
                placeholder="Button Label (Max 25)" 
                className={`w-full p-2.5 border rounded-lg text-sm bg-white outline-none focus:ring-2 ${
                  (watched.buttons[index]?.text?.length > 25) ? 'border-red-500 focus:ring-red-100' : 'focus:ring-green-400'
                }`} 
              />
              <span className={`absolute right-3 top-3 text-[9px] ${
                (watched.buttons[index]?.text?.length > 25) ? 'text-red-500 font-bold' : 'text-gray-400'
              }`}>
                {watched.buttons[index]?.text?.length || 0}/25
              </span>
            </div>
          </div>

          {/* 🔗 URL Field */}
          {buttonType === "URL" && (
            <div className="mt-2 space-y-1">
              <label className="text-[9px] font-bold text-blue-600 ml-1 uppercase tracking-wider">Website URL</label>
              <input 
                {...register(`buttons.${index}.url`)} 
                placeholder="https://www.nedrix.in" 
                className="w-full p-2 border rounded-lg text-xs bg-white focus:border-blue-400 outline-none" 
              />
            </div>
          )}

          {/* 📞 Phone Field */}
          {buttonType === "PHONE_NUMBER" && (
            <div className="mt-2 space-y-1">
              <label className="text-[9px] font-bold text-purple-600 ml-1 uppercase tracking-wider">Phone Number</label>
              <input 
                {...register(`buttons.${index}.phone`)} 
                placeholder="+919876543210" 
                className="w-full p-2 border rounded-lg text-xs bg-white focus:border-purple-400 outline-none" 
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
      </form>

      {/* --- PREVIEW SECTION --- */}
      <div className="w-full lg:w-[400px]">
        <div className="sticky top-8 space-y-6">
          <div className="w-full aspect-[9/18.5] bg-[#E5DDD5] rounded-[3rem] border-[12px] border-gray-900 overflow-hidden shadow-2xl relative">
            <div className="bg-[#075E54] p-5 pt-10 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <p className="font-bold text-xs uppercase tracking-widest">Nedrix Preview</p>
            </div>
            
            <div className="p-4 space-y-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-[90%]">
                {/* 🎞️ Header Preview */}
                {watched.headerType === "IMAGE" && (
                  <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <ImageIcon size={40} className="text-gray-200"/>}
                  </div>
                )}
                {watched.headerType === "VIDEO" && (
                  <div className="w-full aspect-video bg-black flex items-center justify-center">
                    <Film className="text-white opacity-40" />
                  </div>
                )}
                {watched.headerType === "DOCUMENT" && (
                  <div className="w-full h-24 bg-gray-100 border-b flex items-center justify-center gap-2">
                    <FileText size={28} className="text-red-400" />
                    <span className="text-[10px] font-bold text-gray-400">PDF CATALOG</span>
                  </div>
                )}

                <div className="p-3">
                  <p className="text-[13px] text-gray-800 whitespace-pre-wrap">{watched.bodyText || "Your message will appear here..."}</p>
                  <p className="text-[10px] text-gray-400 text-right mt-1">11:00 AM</p>
                </div>
              </div>
              
              <div className="w-[90%] space-y-1">
                {watched.buttons.map((btn, i) => (
                  <div key={i} className="bg-white/90 py-2.5 text-center rounded-xl shadow-sm text-blue-500 text-sm font-semibold active:bg-gray-100 cursor-pointer">
                    {btn.text || `Button ${i+1}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button type="button" onClick={handleSubmit(onSubmit)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 shadow-xl active:scale-95 transition">
            <Save size={20} /> Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}