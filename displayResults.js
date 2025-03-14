function displayResults(results) {
    let tableBody = "";
    let cardView = "";

    results.forEach(({ dia, rods, rodGroups, remainders }) => {
      rods.forEach((rod, i) => {
        let rodNumber = i + 1;
        let totalUsed = rod.reduce((a, b) => a + b, 0).toFixed(2);
        let waste = remainders[i].toFixed(2);
        let formattedRod = rod.map(val => `<span class='highlight'>${val.toFixed(2)}</span>`).join(", ");
        let formattedGroups = rodGroups[i]
          .map(entry => entry.replace(/(\d+\.\d+|\d+)/g, match => `<span class='highlight'>${parseFloat(match).toFixed(2)}</span>`))
          .join(" | ");

        tableBody += `<tr>
          <td>${dia}</td>
          <td>${rodNumber}</td>
          <td>${formattedRod}</td>
          <td>${formattedGroups}</td>
          <td><span class='highlight'>${totalUsed}</span></td>
          <td><span class='highlight'>${waste}</span></td>
        </tr>`;

        cardView += `<div class='card p-3'>
          <h5>Rod ${rodNumber} - Dia ${dia}</h5>
          <p><strong>Lengths Used:</strong> ${formattedRod}</p>
          <p><strong>Usage Details:</strong> ${formattedGroups}</p>
          <p><strong>Total Used:</strong> <span class='highlight'>${totalUsed}</span> cm</p>
          <p><strong>Waste:</strong> <span class='highlight'>${waste}</span> cm</p>
        </div>`;
      });
    });

    document.querySelector("#resultTable tbody").innerHTML = tableBody;
    document.getElementById("cardView").innerHTML = cardView;

    const table = $('#resultTable').DataTable();

    $('.column-filter').on('keyup', function () {
      const columnIndex = $(this).closest('th').index();
      table.column(columnIndex).search(this.value).draw();
    });
  }