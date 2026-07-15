"use client";
import React, { useState, useEffect } from "react";
import { Send, Users, CheckCircle, AlertCircle, Zap, ImageIcon, FileText, Film, Trash2, Smartphone, Table, ChevronRight } from "lucide-react";
import axios from "axios";

export default function V1BroadcastEngine() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // CSV States
  const [csvData, setCsvData] = useState([]); 
  const [headers, setHeaders] = useState([]); 
  const [selectedColIndex, setSelectedColIndex] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/api/templates?status=APPROVED");
        setTemplates(res.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };
    fetchTemplates();
  }, []);

  // 1. Initial File Read (Gets Headers)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split(/\r?\n/).filter(row => row.trim() !== "").map(row => row.split(","));
      
      if (rows.length > 0) {
        setHeaders(rows[0]); // Save first row as headers
        setCsvData(rows.slice(1)); // Save the rest as data
        setSelectedColIndex(null); // Reset mapping
        setPhoneNumbers([]);
      }
    };
    reader.readAsText(file);
  };

  // 2. Column Mapping Logic (The Interakt Way)
  const handleMapColumn = (index) => {
    setSelectedColIndex(index);
    const extracted = csvData
      .map(row => row[index]?.trim().replace(/\D/g, ""))
      .filter(num => num && num.length >= 10);
    
    // Auto-add 91 if exactly 10 digits
    const formatted = extracted.map(num => num.length === 10 ? "91" + num : num);
    setPhoneNumbers([...new Set(formatted)]); // Unique numbers only
  };

  const calculateCost = () => {
    const rate = selectedTemplate?.category === "MARKETING" ? 0.86 : 0.30;
    return (phoneNumbers.length * rate).toFixed(2);
  };

  const handleLaunch = async () => {
    if (!selectedTemplate || phoneNumbers.length === 0) return;
    setIsSending(true);
    try {
      const payload = {
        templateId: selectedTemplate._id,
        templateName: selectedTemplate.name,
        numbers: phoneNumbers,
        category: selectedTemplate.category
      };
      const res = await axios.post("/api/broadcast/launch", payload);
      if (res.status === 200) {
        alert(`🚀 Blast Launched to ${phoneNumbers.length} numbers!`);
        setPhoneNumbers([]);
        setHeaders([]);
      }
    } catch (err) {
      alert("Launch failed. Check backend.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-6">
          <header className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic">
              <Zap className="text-yellow-500 fill-yellow-500" size={32} /> NEDRIX BLAST
            </h1>
          </header>

          {/* STEP 1: SELECT TEMPLATE */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="text-[11px] font-black text-gray-400 uppercase block mb-4 tracking-widest">01. Select Template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map(t => (
                <button
                  key={t._id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedTemplate?._id === t._id ? 'border-green-500 bg-green-50' : 'border-gray-50 bg-white hover:border-gray-200'
                  }`}
                >
                  <p className="font-bold text-sm text-gray-800">{t.name}</p>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{t.category}</span>
                </button>
              ))}
            </div>
          </div>

{/* STEP 2: UPLOAD & MAP (STABLE GRID) */}
<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-500 min-h-[300px] flex flex-col">
  <label className="text-[11px] font-black text-gray-400 uppercase block mb-4 tracking-widest">02. Audience Mapping</label>
  
  {!headers.length ? (
    /* 1. Upload State (Matches height of mapping state) */
    <div className="flex-1 border-4 border-dotted border-gray-100 rounded-3xl flex flex-col items-center justify-center relative hover:bg-gray-50 transition bg-gray-50/30">
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".csv" />
      <Users className="text-gray-300 mb-2" size={48} />
      <p className="text-sm font-bold text-gray-600 uppercase">Upload CSV File</p>
    </div>
  ) : (
    /* 2. Mapping State (Stable Height) */
    <div className="flex-1 flex flex-col animate-in fade-in duration-500">
      
      {/* Scrollable Table Container */}
      <div className="flex-1 border border-gray-100 rounded-2xl overflow-hidden bg-white flex flex-col max-h-[250px]">
        <div className="overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 shadow-sm">
                {headers.map((h, i) => (
                  <th key={i} className="p-2 min-w-[140px] border-r border-white/50 last:border-0">
                    <button 
                      onClick={() => handleMapColumn(i)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between border-2 text-[10px] font-black uppercase tracking-tighter ${
                        selectedColIndex === i 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-blue-200 text-blue-600 hover:border-blue-400'
                      }`}
                    >
                      <span className="truncate">{h || `Col ${i+1}`}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-50 last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className={`p-2 text-[10px] font-medium truncate ${
                        selectedColIndex === cellIndex ? 'bg-blue-50/60 text-blue-700 font-bold' : 'text-gray-400'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Static Footer Info (Doesn't Move) */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex-1">
           {selectedColIndex === null ? (
             <p className="text-[10px] font-black text-blue-500 flex items-center gap-1 animate-pulse uppercase tracking-tight">
               <AlertCircle size={12}/> Select the Phone Column above
             </p>
           ) : (
             <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={14}/>
                <span className="text-[11px] font-black text-green-700 uppercase">
                  {phoneNumbers.length} Nos Selected
                </span>
             </div>
           )}
        </div>
        <button 
          onClick={() => {setHeaders([]); setPhoneNumbers([]); setSelectedColIndex(null)}} 
          className="text-[10px] text-red-500 font-black uppercase underline ml-4 whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>
  )}
</div>
          
        </div>

        {/* --- RIGHT: PREVIEW --- */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-8 space-y-6">
            <div className="w-full aspect-[9/18.5] bg-[#E5DDD5] rounded-[3.5rem] border-[12px] border-gray-900 overflow-hidden shadow-2xl relative">
              <div className="bg-[#075E54] p-6 pt-12 text-white flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full" />
                <p className="font-bold text-xs uppercase">Nedrix Preview</p>
              </div>

              <div className="p-4">
                {selectedTemplate ? (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-in zoom-in duration-300">
                    {selectedTemplate.headerType !== "NONE" && (
                      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center border-b">
                        <ImageIcon size={30} className="text-gray-300" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-[12px] text-gray-800">{selectedTemplate.bodyText}</p>
                    </div>
                    {selectedTemplate.buttons?.map((btn, i) => (
                      <div key={i} className="py-2 text-center text-blue-500 text-[13px] font-bold border-t border-gray-50 bg-white/50">
                        {btn.text}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center mt-32 text-gray-400">
                    <Smartphone className="mx-auto opacity-20 mb-2" size={48} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Select Template</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{calculateCost()}</span>
              </div>
              <button 
                onClick={handleLaunch}
                disabled={!selectedTemplate || phoneNumbers.length === 0 || isSending}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 disabled:bg-gray-200 transition-all shadow-lg"
              >
                {isSending ? "BLASTING..." : "LAUNCH BLAST"}
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}