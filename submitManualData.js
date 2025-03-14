function submitManualData() {
    const tableRows = document.querySelectorAll('#manualInputTable tbody tr');
    const formattedData = [];

    tableRows.forEach(row => {
      const dia = row.querySelector('.dia-input').value.trim();
      const size = parseFloat(row.querySelector('.size-input').value);
      const nos = parseInt(row.querySelector('.nos-input').value, 10);

      if (dia && !isNaN(size) && !isNaN(nos) && size > 0 && nos > 0) {
        formattedData.push({ dia, size, nos });
      }
    });

    if (formattedData.length === 0) {
      alert('Please enter valid data.');
      return;
    }

    $('#manualInputModal').modal('hide'); // Close the modal
    optimizeRebarUsage(formattedData); // Process entered data
    document.getElementById("downloadDiv").style.display = "inline-block";
    document.getElementById("summaryContainer").style.display = "flex";

    // Clear form and reset with one blank row
    resetManualInputTable();
  }