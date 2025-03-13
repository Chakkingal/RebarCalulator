function optimizeRebarUsage(data) {
    const standardLength = 1200; // cm
    let rods = [],
      remainders = [],
      rodGroups = [];
    let requiredLengths = data.map((row) => [
      parseFloat(row[Object.keys(row)[0]]),
      row[Object.keys(row)[1]],
    ]);
    requiredLengths.sort((a, b) => b[0] - a[0]);

    requiredLengths.forEach(([size, qty]) => {
      for (let i = 0; i < qty; i++) {
        let placed = false;
        for (let j = 0; j < remainders.length; j++) {
          if (remainders[j] >= size) {
            rods[j].push(size);
            rodGroups[j].push(
              `Used ${size} cm from remaining ${remainders[j]} cm`
            );
            remainders[j] -= size;
            placed = true;
            break;
          }
        }
        if (!placed) {
          rods.push([size]);
          remainders.push(standardLength - size);
          rodGroups.push([`New rod, used ${size} cm`]);
        }
      }
    });
    displayResults(rods, rodGroups, remainders);
  }