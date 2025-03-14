function optimizeRebarUsage(data) {
    const standardLength = 1200; // cm
    let results = [];
    let diaMapping = {};
    
    data.forEach(({ dia, size, nos }) => {
      if (!diaMapping[dia]) diaMapping[dia] = [];
      diaMapping[dia].push({ size, qty: nos });
    });
  
    let rodsSummary = {}; // Corrected rod summary calculation
  
    Object.entries(diaMapping).forEach(([dia, lengths]) => {
      let rods = [], remainders = [], rodGroups = [];
  
      lengths.sort((a, b) => b.size - a.size);
  
      lengths.forEach(({ size, qty }) => {
        for (let i = 0; i < qty; i++) {
          let placed = false;
          for (let j = 0; j < remainders.length; j++) {
            if (remainders[j] >= size) {
              rods[j].push(size);
              rodGroups[j].push(`Used ${size.toFixed(2)} cm from remaining ${remainders[j].toFixed(2)} cm`);
              remainders[j] -= size;
              placed = true;
              break;
            }
          }
          if (!placed) {
            rods.push([size]);
            remainders.push(standardLength - size);
            rodGroups.push([`New rod, used ${size.toFixed(2)} cm`]);
          }
        }
      });
  
      results.push({ dia, rods, rodGroups, remainders });
  
      // ✅ Correct Rod Summary: Count the actual rods used for each diameter
      rodsSummary[dia] = rods.length;
    });
  
    displayResults(results);
    displaySummaryTables(data, rodsSummary);
  }