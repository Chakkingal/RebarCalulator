function downloadPDF() {
    const downloadBtn = document.getElementById("downloadPDFBtn");
    const downloadText = document.getElementById("downloadText");
    const downloadSpinner = document.getElementById("downloadSpinner");
    const downloadOption = document.getElementById("downloadOption").value;
  
    // ✅ Disable "Download PDF" button to prevent double clicks
    downloadBtn.disabled = true;
    downloadText.innerText = "Generating PDF...";
    downloadSpinner.style.display = "inline-block";
  
    const cloudinaryURL = "https://res.cloudinary.com/dutl6gkzn/image/upload/v1741866777/INSIGHT_LOGO_without_bg_bqdtb3.png";
  
    // ✅ Convert Cloudinary Image to Base64 before using it
    convertImageToBase64(cloudinaryURL, function (base64Image) {
      const tableData = [];
      const headers = [];
      document.querySelectorAll("#resultTable thead tr th").forEach((th) =>
        headers.push(th.innerText.trim())
      );
  
      const table = $("#resultTable").DataTable();
  
      if (downloadOption === "full") {
        table.rows({ search: "none" }).every(function () {
          let rowData = [];
          this.nodes()
            .to$()
            .find("td")
            .each(function () {
              rowData.push($(this).text().trim());
            });
          tableData.push(rowData);
        });
      } else if (downloadOption === "current") {
        table.rows({ page: "current", search: "applied" }).every(function () {
          let rowData = [];
          this.nodes()
            .to$()
            .find("td")
            .each(function () {
              rowData.push($(this).text().trim());
            });
          tableData.push(rowData);
        });
      }
  
      if (tableData.length === 0) {
        throw new Error("No data found in the table.");
      }
  
      const numColumns = headers.length;
      tableData.forEach((row, index) => {
        if (row.length !== numColumns) {
          throw new Error(
            `Row ${index + 1} has ${row.length} columns, but expected ${numColumns}.`
          );
        }
      });
  
      // ✅ Define PDF Content with watermark
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
            text: `${currentPage} of ${pageCount}`,
            alignment: "right",
            margin: [10, 10, 10, 10],
          };
        },
        content: [
          {
            table: {
              headerRows: 1,
              widths: Array(numColumns).fill("*"),
              body: [headers, ...tableData],
            },
          },
        ],
        styles: {
          header: { fontSize: 16, bold: true },
          footer: { fontSize: 10 },
        },
        images: { watermarkImg: base64Image }, // ✅ Use dynamically loaded Base64
        defaultStyle: {
          fontSize: 10,
          margin: [0, 5],
        },
      };
  
      // ✅ Generate and Download PDF
      pdfMake.createPdf(docDefinition).download("Optimized_Rebar_Cutting_Length.pdf");
  
      // ✅ Re-enable Download Button
      downloadBtn.disabled = false;
      downloadText.innerText = "Download PDF";
      downloadSpinner.style.display = "none";
    });
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
  