// Load all records
function loadRecords() {
  const tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  db.collection("vitals").orderBy("date").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="radio" name="recordSelect" value="${doc.id}"></td>
        <td>${data.date || ''}</td>
        <td>${data.morning?.temp || ''}</td>
        <td>${data.morning?.bp || ''}</td>
        <td>${data.morning?.pr || ''}</td>
        <td>${data.morning?.spo2 || ''}</td>
        <td>${data.evening?.temp || ''}</td>
        <td>${data.evening?.bp || ''}</td>
        <td>${data.evening?.pr || ''}</td>
        <td>${data.evening?.spo2 || ''}</td>
        <td>${data.capping?.start || ''}</td>
        <td>${data.capping?.start_pr || ''}</td>
        <td>${data.capping?.start_spo2 || ''}</td>
        <td>${data.capping?.end || ''}</td>
        <td>${data.capping?.end_pr || ''}</td>
        <td>${data.capping?.end_spo2 || ''}</td>
        <td>${data.io?.input || ''}</td>
        <td>${data.io?.output || ''}</td>
        <td>${data.misc?.motionPassed || ''}</td>
        <td>${data.misc?.tSecretions || ''}</td>
        <td>${data.misc?.oralSuction || ''}</td>
        <td>${data.misc?.rbs || ''}</td>
        <td>${data.notes?.physio || ''}</td>
        <td>${data.notes?.swallow || ''}</td>
        <td>${data.notes?.misc || ''}</td>
        <td>${Array.isArray(data.medications) ? data.medications.join(", ") : ''}</td>
      `;
      tbody.appendChild(row);
    });
  });
}

// Filter records by month
function filterByMonth() {
  const monthInput = document.getElementById("monthSelect").value;
  if (!monthInput) {
    alert("Please select a month.");
    return;
  }
  const [year, month] = monthInput.split("-");
  const startDate = `${year}-${month}-01`;
  const endDate = new Date(year, parseInt(month), 0).toISOString().split("T")[0];

  const tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  db.collection("vitals")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="radio" name="recordSelect" value="${doc.id}"></td>
          <td>${data.date || ''}</td>
          <td>${data.morning?.temp || ''}</td>
          <td>${data.morning?.bp || ''}</td>
          <td>${data.morning?.pr || ''}</td>
          <td>${data.morning?.spo2 || ''}</td>
          <td>${data.evening?.temp || ''}</td>
          <td>${data.evening?.bp || ''}</td>
          <td>${data.evening?.pr || ''}</td>
          <td>${data.evening?.spo2 || ''}</td>
          <td>${data.capping?.start || ''}</td>
          <td>${data.capping?.start_pr || ''}</td>
          <td>${data.capping?.start_spo2 || ''}</td>
          <td>${data.capping?.end || ''}</td>
          <td>${data.capping?.end_pr || ''}</td>
          <td>${data.capping?.end_spo2 || ''}</td>
          <td>${data.io?.input || ''}</td>
          <td>${data.io?.output || ''}</td>
          <td>${data.misc?.motionPassed || ''}</td>
          <td>${data.misc?.tSecretions || ''}</td>
          <td>${data.misc?.oralSuction || ''}</td>
          <td>${data.misc?.rbs || ''}</td>
          <td>${data.notes?.physio || ''}</td>
          <td>${data.notes?.swallow || ''}</td>
          <td>${data.notes?.misc || ''}</td>
          <td>${Array.isArray(data.medications) ? data.medications.join(", ") : ''}</td>
        `;
        tbody.appendChild(row);
      });
    });
}

// Edit record → redirect to form.html with ID
function editRecord() {
  const selected = document.querySelector('input[name="recordSelect"]:checked');
  if (!selected) {
    alert("Please select a record to edit.");
    return;
  }
  const docId = selected.value;
  window.location.href = `form.html?id=${docId}`;
}

// Delete record
function deleteRecord() {
  const selected = document.querySelector('input[name="recordSelect"]:checked');
  if (!selected) {
    alert("Please select a record to delete.");
    return;
  }
  if (confirm("Are you sure you want to delete this record?")) {
    const docId = selected.value;
    db.collection("vitals").doc(docId).delete()
      .then(() => {
        alert("Record deleted successfully");
        loadRecords();
      })
      .catch(err => console.error("Error deleting:", err));
  }
}

// Back to dashboard
function goBack() {
  window.location.href = "index.html";
}

// Load records on page ready
document.addEventListener("DOMContentLoaded", loadRecords);
