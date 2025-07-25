const fileInput = document.getElementById("fileInput");
const organizeBtn = document.getElementById("organizeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const preview = document.getElementById("organizedPreview");

let organizedFiles = {};
let zip = new JSZip();

const fileTypes = {
  images: ["jpg", "jpeg", "png", "gif", "svg"],
  documents: ["pdf", "docx", "doc", "txt"],
  archives: ["zip", "rar"],
  media: ["mp3", "mp4", "wav", "mov"],
};

organizeBtn.onclick = () => {
  const files = Array.from(fileInput.files);
  if (files.length === 0) {
    alert("Please select files first.");
    return;
  }

  organizedFiles = {
    images: [],
    documents: [],
    archives: [],
    media: [],
    others: []
  };
  zip = new JSZip(); // Reset ZIP

  files.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    let added = false;
    for (let type in fileTypes) {
      if (fileTypes[type].includes(ext)) {
        organizedFiles[type].push(file);
        added = true;
        break;
      }
    }
    if (!added) {
      organizedFiles.others.push(file);
    }
  });

  renderPreview();
  prepareZip();
};

function renderPreview() {
  preview.innerHTML = "";
  for (let type in organizedFiles) {
    if (organizedFiles[type].length > 0) {
      const section = document.createElement("div");
      section.className = "category";
      section.innerHTML = `<h3>${type.toUpperCase()}</h3>`;
      const list = organizedFiles[type].map(f => `<p>${f.name}</p>`).join("");
      section.innerHTML += list;
      preview.appendChild(section);
    }
  }
  downloadBtn.disabled = false;
}

function prepareZip() {
  for (let type in organizedFiles) {
    const folder = zip.folder(type);
    organizedFiles[type].forEach(file => {
      folder.file(file.name, file);
    });
  }
}

downloadBtn.onclick = async () => {
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "organized_files.zip";
  a.click();
};
