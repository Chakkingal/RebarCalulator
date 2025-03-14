function openManualInputModal() {
    $('#manualInputModal').modal('show');
    resetManualInputTable(); // Ensures at least one empty row appears
  }