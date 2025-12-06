// Configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCzWndZg0_fC_4A5DwnIdnSzdDETHr4AgM",
  authDomain: "patientdetailtracker.firebaseapp.com",
  projectId: "patientdetailtracker",
  storageBucket: "patientdetailtracker.appspot.com",
  messagingSenderId: "106435750356",
  appId: "1:106435750356:web:db1c90b3cc89253a5e8e41"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Save to Firestore
function saveVitalsData() {
  const data = collectVitalsData(); // from main.js
  db.collection("vitals").add(data)
    .then(() => alert("Vitals saved to Firestore!"))
    .catch(err => console.error("Error saving vitals:", err));
}

// ✅ Export to Excel
function exportToExcel() {
  db.collection("vitals").get().then(snapshot => {
    const data = [];

    snapshot.forEach(doc => {
      const d = doc.data();

      // Flatten and transform fields
      data.push({
        Date: d.date,
        Morning_Temp: d.morning?.temp,
        Morning_BP: d.morning?.bp,
        Morning_PR: d.morning?.pr,
        Morning_SpO2: d.morning?.spo2,
        Evening_Temp: d.evening?.temp,
        Evening_BP: d.evening?.bp,
        Evening_PR: d.evening?.pr,
        Evening_SpO2: d.evening?.spo2,
        RBS: d.misc?.rbs,
        Input_ml: d.io?.input,
        Output_ml: d.io?.output,
        Motion_Passed: d.misc?.motionPassed,
        Trachea_Secretions: d.misc?.tSecretions,
        Oral_Suction: d.misc?.oralSuction,
        Physio_Notes: d.notes?.physio,
        Swallow_Notes: d.notes?.swallow,
        Misc_Notes: d.notes?.misc,
        Medications: d.medications?.join(", "),
        "Capping Done": d.cappingEnabled ? "Yes" : "No", // ✅ renamed + Yes/No
        Capping_Start: d.capping?.start,
        Capping_Start_PR: d.capping?.start_pr,
        Capping_Start_SpO2: d.capping?.start_spo2,
        Capping_End: d.capping?.end,
        Capping_End_PR: d.capping?.end_pr,
        Capping_End_SpO2: d.capping?.end_spo2
      });
    });

    // 🔑 Insert sorting here
    data.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    // 1️⃣ Create worksheet first
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2️⃣ Then apply bold style to header row
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = { font: { bold: true } };
    }

    // 3️⃣ Build workbook and save
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vitals");
    XLSX.writeFile(workbook, "Vitals.xlsx");    
  });
}
