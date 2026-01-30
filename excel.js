// Utility: open/close popup
function openDownloadPopup() {
  document.getElementById("popupOverlay").style.display = "block";
  document.getElementById("downloadPopup").style.display = "block";
}

function closeDownloadPopup() {
  document.getElementById("popupOverlay").style.display = "none";
  document.getElementById("downloadPopup").style.display = "none";
}


// Utility: convert month number to name
function getMonthName(monthNumber) {
  const names = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  return names[monthNumber - 1];
}

// Build worksheet rows from Firestore data
function buildRows(snapshot) {
  const rows = [];
  snapshot.forEach(doc => {
    const d = doc.data();
    rows.push([
      d.date || "",
      d.morning?.temp || "",
      d.morning?.bp || "",
      d.morning?.pr || "",
      d.morning?.spo2 || "",
      d.evening?.temp || "",
      d.evening?.bp || "",
      d.evening?.pr || "",
      d.evening?.spo2 || "",
      d.capping.start || "",
      d.capping.start_pr || "",
      d.capping.start_spo2 || "",
      d.capping.end || "",
      d.capping.end_pr || "",
      d.capping.end_spo2 || "",
      d.io?.input || "",
      d.io?.output || "",
      d.misc?.motionPassed || "",
      d.misc?.tSecretions || "",
      d.misc?.oralSuction || "",
      d.misc?.rbs || "",
      d.notes?.physio || "",
      d.notes?.swallow || "",
      d.notes?.misc || "",
      Array.isArray(d.medications) ? d.medications.join(", ") : ""
    ]);
  });
  return rows;
}

// Apply bold style to header row
function styleHeaderRow(worksheet) {
  worksheet.getRow(2).font = { bold: true }; // row 2 is header row (row 1 is title)
}

// Download monthly Excel
async function downloadMonthlyExcel() {
  const monthInput = document.getElementById("monthSelect").value;
  if (!monthInput) {
    alert("Please select a month and year.");
    return;
  }

  const [year, month] = monthInput.split("-");
  const startDate = `${year}-${month}-01`;
  const endDate = new Date(year, parseInt(month), 0).toISOString().split("T")[0];
  const monthName = getMonthName(parseInt(month));

  const snapshot = await db.collection("vitals")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date")
    .get();

  const rows = buildRows(snapshot);
  if (rows.length === 0) {
    alert(`No records found for ${monthName} ${year}.`);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Vitals");

  // Title row
  worksheet.addRow([`Vitals Report – ${monthName} ${year}`]);
  worksheet.mergeCells("A1:T1");
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(1).alignment = { horizontal: "center" };

  // Header row
  worksheet.addRow([
    "Date","MorningTemp","MorningBP","MorningPR","MorningSpO2",
    "EveningTemp","EveningBP","EveningPR","EveningSpO2",
    "Capping Start Time", "PR @ Start Time", "SpO2 @ Start Time",
    "Capping End Time", "PR @ End Time", "SpO2 @ End Time",
    "Input","Output","Motion","Secretions","OralSuction","RBS",
    "Physio","Swallow","MiscNotes","Medications"
  ]);
  styleHeaderRow(worksheet);

  // Data rows
  rows.forEach(r => worksheet.addRow(r));

  const filename = `Vitals_${monthName}_${year}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  alert(`Monthly report downloaded: ${filename}`);
  closeDownloadPopup();
}

// Download all records
async function downloadAllExcel() {
  const snapshot = await db.collection("vitals").orderBy("date").get();
  const rows = buildRows(snapshot);
  if (rows.length === 0) {
    alert("No records found.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Vitals");

  // Title row
  worksheet.addRow(["Vitals Report – All Records"]);
  worksheet.mergeCells("A1:T1");
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(1).alignment = { horizontal: "center" };

  // Header row
  worksheet.addRow([
    "Date","MorningTemp","MorningBP","MorningPR","MorningSpO2",
    "EveningTemp","EveningBP","EveningPR","EveningSpO2", 
    "Capping Start Time", "PR @ Start Time", "SpO2 @ Start Time",
    "Capping End Time", "PR @ End Time", "SpO2 @ End Time",
    "Input","Output","Motion","Secretions","OralSuction","RBS",
    "Physio","Swallow","MiscNotes","Medications"
  ]);
  styleHeaderRow(worksheet);

  // Data rows
  rows.forEach(r => worksheet.addRow(r));

  const filename = `Vitals_AllRecords.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  alert(`All records downloaded: ${filename}`);
}
