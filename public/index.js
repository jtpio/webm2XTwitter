import { FFmpeg } from "./assets/ffmpeg/package/dist/esm/index.js";
import { fetchFile } from "./assets/util/package/dist/esm/index.js";

const CORE_MT_URL = "/assets/core-mt/package/dist/esm/ffmpeg-core.js";

// TODO: make this configurable?
const FFMPEG_ARGS = [
  "-c:v",
  "libx264",
  "-profile:v",
  "main",
  "-preset",
  "fast",
  "-crf",
  "21",
  "-vf",
  "scale=2560:1440,format=yuv420p",
  "-r",
  "30",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-ar",
  "44100",
];

const inputVideo = document.getElementById("input-video");
const logs = document.getElementById("progress-logs");
const dropArea = document.getElementById("drop-area");
const inputElement = document.getElementsByTagName("input")[0];
const progressBar = document.getElementById("progress-bar");
const convertButton = document.getElementById("convert-button");
const downloadButton = document.getElementById("download-button");

let ffmpeg = null;

const updateProgress = (progress) => {
  progress = Math.round(progress * 100);
  progressBar.style.width = `${progress}%`;
  progressBar.innerHTML = `${progress}%`;
};

const showResults = () => {
  const results = document.getElementById("results");
  results.classList.remove("invisible");
};

const transcode = async (file) => {
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
      logs.innerHTML += `${message}<br>`;
    });
    ffmpeg.on("progress", ({ progress }) => {
      updateProgress(progress);
      console.log(`${progress * 100} %`);
    });
    await ffmpeg.load({
      coreURL: CORE_MT_URL,
    });
  }
  const { name } = file;
  await ffmpeg.writeFile(name, await fetchFile(file));
  logs.innerHTML = "Start transcoding<br>";
  console.log("Start transcoding");

  await ffmpeg.exec(["-i", name, ...FFMPEG_ARGS, "output.mp4"]);
  logs.innerHTML += "Complete transcoding<br>";
  console.log("Complete transcoding");
  const outputName = "output.mp4";
  const data = await ffmpeg.readFile(outputName);

  const video = document.getElementById("output-video");
  video.src = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  downloadButton.disabled = false;
  // download the video on click
  downloadButton.onclick = () => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    a.download = outputName;
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  };
};

const handleFile = (file) => {
  console.log(file);
  inputVideo.src = URL.createObjectURL(file, { type: "video/webm" });

  showResults();

  convertButton.onclick = () => {
    transcode(file);
    convertButton.disabled = true;
  };
};

inputElement.addEventListener(
  "change",
  () => {
    const file = inputElement.files[0];
    handleFile(file);
  },
  false
);

dropArea.addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.preventDefault();
  dropArea.classList.add("bg-blue-100", "border-blue-500");
});

dropArea.addEventListener("dragleave", (event) => {
  dropArea.classList.remove("bg-blue-100", "border-blue-500");
});

dropArea.addEventListener("drop", (event) => {
  event.stopPropagation();
  event.preventDefault();
  dropArea.classList.remove("bg-blue-100", "border-blue-500");

  const files = event.dataTransfer.files;
  const file = files[0];
  if (!file) {
    console.error("No file found");
    return;
  }
  handleFile(file);
});
