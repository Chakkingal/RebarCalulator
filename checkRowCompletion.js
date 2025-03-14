function checkRowCompletion(input) {
    const row = input.closest('tr');
    const dia = row.querySelector('.dia-input').value.trim();
    const size = row.querySelector('.size-input').value.trim();
    const nos = row.querySelector('.nos-input').value.trim();
  
    if (dia !== "" && size !== "" && nos !== "") {
      const tableBody = document.querySelector('#manualInputTable tbody');
      const lastRow = tableBody.lastElementChild;
  
      // Ensure a new row is only added when the last row is fully filled
      if (row === lastRow) {
        addManualInputRow();
      }
    }
  }