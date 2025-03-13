function displayResults(rods, rodGroups, remainders) {
    let tableBody = "";
    let cardView = "";

    rods.forEach((rod, i) => {
        let rodNumber = i + 1;
        let totalUsed = (Math.round(rod.reduce((a, b) => a + b, 0) * 100) / 100).toFixed(2);
        let waste = (Math.round(remainders[i] * 100) / 100).toFixed(2);
        let formattedRod = rod.map((val) => (Math.round(val * 100) / 100).toFixed(2));

        let formattedGroups = rodGroups[i]
            .map((entry) =>
                entry.replace(/(\d+\.\d+|\d+)/g, (match) => 
                    `<span class="highlight">${(Math.round(parseFloat(match) * 100) / 100).toFixed(2)}</span>`
                )
            )
            .join(" | ");

        tableBody += `<tr>
            <td>${rodNumber}</td>
            <td>${formattedRod.map(num => `<span class="highlight">${num}</span>`).join(", ")}</td>
            <td>${formattedGroups}</td>
            <td><span class="highlight">${totalUsed}</span></td>
            <td><span class="highlight">${waste}</span></td>
        </tr>`;

        cardView += `<div class='card p-3'>
            <h5>Rod ${rodNumber}</h5>
            <p><strong>Lengths Used:</strong> ${formattedRod.map(num => `<span class="highlight">${num}</span>`).join(", ")}</p>
            <p><strong>Usage Details:</strong> ${formattedGroups}</p>
            <p><strong>Total Used:</strong> <span class="highlight">${totalUsed}</span> cm</p>
            <p><strong>Waste:</strong> <span class="highlight">${waste}</span> cm</p>
        </div>`;
    });

    $("#resultTable tbody").html(tableBody);
    $("#cardView").html(cardView);

    // ✅ Properly Initialize DataTable with Filtering
    if (!$.fn.DataTable.isDataTable("#resultTable")) {
        $("#resultTable").DataTable({
            destroy: true,
            searching: true,  // ✅ Ensure filtering is enabled
            paging: true,
            ordering: true,
            info: true,
            columnDefs: [{ targets: 0, type: "num" }], // Numeric sorting for first column
        });
    } else {
        $("#resultTable").DataTable().clear().rows.add($(tableBody)).draw();
    }
}
