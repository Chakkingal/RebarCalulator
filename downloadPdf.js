function downloadPDF() {
    const downloadBtn = document.getElementById("downloadPDFBtn");
    const downloadText = document.getElementById("downloadText");
    const downloadSpinner = document.getElementById("downloadSpinner");
    const downloadOption = document.getElementById("downloadOption").value;
  
    // Disable "Download PDF" button to prevent double clicks
    downloadBtn.disabled = true;
    downloadText.innerText = "Generating PDF...";
    downloadSpinner.style.display = "inline-block";
  
    const cloudinaryURL = "https://res.cloudinary.com/dutl6gkzn/image/upload/v1741866777/INSIGHT_LOGO_without_bg_bqdtb3.png";
  
    convertImageToBase64(cloudinaryURL, function (base64Image) {
      const resultTableData = [];
      const headers = [];
      document.querySelectorAll("#resultTable thead tr th").forEach((th) =>
        headers.push(th.innerText.trim())
      );
  
      const table = $("#resultTable").DataTable();
  
      // ✅ Get data based on the selected option (Full or Current Page)
      if (downloadOption === "full") {
        table.rows({ search: "none" }).every(function () {
          let rowData = [];
          this.nodes().to$().find("td").each(function () {
            rowData.push($(this).text().trim());
          });
          resultTableData.push(rowData);
        });
      } else if (downloadOption === "current") {
        table.rows({ page: "current", search: "applied" }).every(function () {
          let rowData = [];
          this.nodes().to$().find("td").each(function () {
            rowData.push($(this).text().trim());
          });
          resultTableData.push(rowData);
        });
      }
  
      if (resultTableData.length === 0) {
        alert("No data available to download.");
        resetDownloadButton();
        return;
      }
  
      // ✅ Ensure all rows have the correct number of columns
      const numColumns = headers.length;
      resultTableData.forEach((row, index) => {
        if (row.length !== numColumns) {
          console.error(`Row ${index + 1} has incorrect columns.`);
        }
      });
  
      // ✅ Extract Summary of Rods Used
      const rodsSummaryData = [];
      $("#rodsSummaryTable tbody tr").each(function () {
        let rowData = [];
        $(this).find("td").each(function () {
          rowData.push($(this).text().trim());
        });
        rodsSummaryData.push(rowData);
      });
  
      // ✅ Extract Summary of Sizes and Nos
      const sizesSummaryData = [];
      $("#sizesSummaryTable tbody tr").each(function () {
        let rowData = [];
        $(this).find("td").each(function () {
          rowData.push($(this).text().trim());
        });
        sizesSummaryData.push(rowData);
      });
  
      // ✅ Construct PDF Content
      const docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
        background: function () {
          return {
            image: "watermarkImg",
            width: 500,
            opacity: 0.1,
            alignment: "center",
            margin: [0, 100],
          };
        },
        header: {
          text: "Optimized Rebar Cutting Length",
          style: "header",
          alignment: "center",
          margin: [0, 10, 0, 10],
        },
        footer: function (currentPage, pageCount) {
          return {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            margin: [10, 10, 10, 10],
          };
        },
        content: [
          { text: "Summary of Rods Used", style: "subheader", margin: [0, 10, 0, 5] },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*"],
              body: [["Dia", "Number of Rods"], ...rodsSummaryData],
            },
          },
          { text: "Summary of Sizes and Nos", style: "subheader", margin: [0, 10, 0, 5] },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*"],
              body: [["Dia", "Size (cm)", "Nos"], ...sizesSummaryData],
            },
          },
          { text: "Optimized Rebar Cutting Table", style: "subheader", margin: [0, 10, 0, 5] },
          {
            table: {
              headerRows: 1,
              widths: Array(numColumns).fill("*"),
              body: [headers, ...resultTableData],
            },
          },
        ],
        styles: {
          header: { fontSize: 16, bold: true },
          subheader: { fontSize: 12, bold: true, margin: [0, 10] },
          tableHeader: { bold: true, fontSize: 10 },
        },
        images: { watermarkImg: base64Image }, // ✅ Use dynamically loaded Base64 image
        defaultStyle: { fontSize: 10, margin: [0, 5] },
      };
  
      // ✅ Generate and Download PDF
      pdfMake.createPdf(docDefinition).download("Optimized_Rebar_Cutting_Length.pdf");
  
      // ✅ Reset Download Button
      resetDownloadButton();
    });
  }
  
  // ✅ Function to Reset the Download Button
  function resetDownloadButton() {
    const downloadBtn = document.getElementById("downloadPDFBtn");
    const downloadText = document.getElementById("downloadText");
    const downloadSpinner = document.getElementById("downloadSpinner");
  
    downloadBtn.disabled = false;
    downloadText.innerText = "Download PDF";
    downloadSpinner.style.display = "none";
  }
  
  // ✅ Function to Convert Cloudinary Image to Base64
  function convertImageToBase64(url, callback) {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.error("Error loading image:", err);
        alert("Error loading watermark image.");
      });
  }
  