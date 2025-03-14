function displaySummaryTables(data, rodsSummary) {
  const sizesSummary = {};

  data.forEach(({ dia, size, nos }) => {
    if (!sizesSummary[dia]) sizesSummary[dia] = {};
    if (!sizesSummary[dia][size]) sizesSummary[dia][size] = 0;
    sizesSummary[dia][size] += nos;
  });

  // ✅ Corrected Rods Summary Table
  const rodsSummaryTableBody = Object.entries(rodsSummary)
    .map(
      ([dia, count]) => `
      <tr><td>${dia}</td><td>${count}</td></tr>
    `
    )
    .join("");

  const sizesSummaryTableBody = Object.entries(sizesSummary)
    .map(([dia, sizes]) =>
      Object.entries(sizes)
        .map(
          ([size, nos]) => `
        <tr><td>${dia}</td><td>${size}</td><td>${nos}</td></tr>
      `
        )
        .join("")
    )
    .join("");

  document.querySelector("#rodsSummaryTable tbody").innerHTML =
    rodsSummaryTableBody;
  document.querySelector("#sizesSummaryTable tbody").innerHTML =
    sizesSummaryTableBody;

  $("#rodsSummaryTable").DataTable();
  $("#sizesSummaryTable").DataTable();
}
