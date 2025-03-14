function addManualInputRow() {
  const tableBody = document.querySelector('#manualInputTable tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="form-control dia-input" placeholder="Enter Dia" oninput="checkRowCompletion(this)"></td>
    <td><input type="number" class="form-control size-input" placeholder="Enter Size" oninput="checkRowCompletion(this)"></td>
    <td><input type="number" class="form-control nos-input" placeholder="Enter Nos" oninput="checkRowCompletion(this)"></td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="deleteManualInputRow(this)">Delete</button>
    </td>
  `;
  tableBody.appendChild(newRow);
}