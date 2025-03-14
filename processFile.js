function processFile() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) return alert("Please select an Excel file.");
  
    // Disable Optimize button while processing
    const optimizeBtn = document.querySelector('button[onclick="processFile()"]');
    optimizeBtn.disabled = true;
    optimizeBtn.innerText = "Processing...";
  
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        if (jsonData.length === 0) {
          alert("Error: The uploaded file is empty.");
          resetButton(optimizeBtn);
          return;
        }
  
        // ✅ Extract Headers and Find Column Indexes
        const headers = jsonData[0].map(h => h.toLowerCase().trim());
        const diaIndex = headers.indexOf("dia");
        const sizeIndex = headers.indexOf("size");
        const nosIndex = headers.indexOf("nos");
  
        if (diaIndex === -1 || sizeIndex === -1 || nosIndex === -1) {
          alert("Error: Missing required columns (Dia, Size, Nos) in Excel.");
          resetButton(optimizeBtn);
          return;
        }
  
        // ✅ Extract Data from Sheet
        const formattedData = jsonData.slice(1).map(row => ({
          dia: row[diaIndex] ? String(row[diaIndex]).trim() : "",
          size: parseFloat(row[sizeIndex]) || 0,
          nos: parseInt(row[nosIndex], 10) || 0
        })).filter(entry => entry.dia && entry.size > 0 && entry.nos > 0);
  
        if (formattedData.length === 0) {
          alert("Error: No valid data found in the uploaded file.");
          resetButton(optimizeBtn);
          return;
        }
  
        // ✅ Call Optimization Function
        optimizeRebarUsage(formattedData);
        document.getElementById("downloadDiv").style.display = "inline-block";
        document.getElementById("summaryContainer").style.display = "flex";
      } catch (error) {
        console.error("File processing error:", error);
        alert("Error reading file. Please check the format.");
      } finally {
        resetButton(optimizeBtn);
      }
    };
  
    reader.readAsArrayBuffer(fileInput);
  }