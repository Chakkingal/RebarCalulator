function processFile() {
  const fileInput = document.getElementById("fileInput").files[0];
  if (!fileInput) return alert("Please select an Excel file.");

  // ✅ Disable "Optimize" button to prevent double clicks
  const optimizeBtn = document.querySelector('button[onclick="processFile()"]');
  optimizeBtn.disabled = true;
  optimizeBtn.innerText = "Processing...";

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // ✅ Read headers

    if (jsonData.length === 0) {
      alert("Error: The uploaded file is empty.");
      resetButton(optimizeBtn);
      return;
    }

    // ✅ Extract headers from the first row
    const headers = jsonData[0].map((h) => h.toLowerCase().trim()); // Convert headers to lowercase
    if (headers[0] !== "size" || headers[1] !== "nos") {
      alert('Error: The first two columns must have headers "Size" and "Nos".');
      resetButton(optimizeBtn);
      return;
    }

    // ✅ Convert sheet to JSON starting from the second row (ignoring headers)
    const formattedData = XLSX.utils.sheet_to_json(sheet);
    if (formattedData.length === 0) {
      alert("Error: No data found in the file.");
      resetButton(optimizeBtn);
      return;
    }

    optimizeRebarUsage(formattedData);

    // ✅ Enable "Optimize" button & Show "Download PDF" button
    resetButton(optimizeBtn);
    document.getElementById("downloadDiv").style.display = "inline-block";
  };

  reader.readAsArrayBuffer(fileInput);
}