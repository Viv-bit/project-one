import fs from "fs";

const files = [
  {
    src: "/Users/fatima/.gemini/antigravity-ide/brain/81dc2c6e-a68a-442a-90e0-f00fe985dd39/episode_51_thumbnail_1792575905223.jpg",
    dest: "/Users/fatima/Work/project-one/public/images/episode-51.jpg"
  },
  {
    src: "/Users/fatima/.gemini/antigravity-ide/brain/81dc2c6e-a68a-442a-90e0-f00fe985dd39/episode_52_thumbnail_1792575928597.jpg",
    dest: "/Users/fatima/Work/project-one/public/images/episode-52.jpg"
  },
  {
    src: "/Users/fatima/.gemini/antigravity-ide/brain/81dc2c6e-a68a-442a-90e0-f00fe985dd39/episode_53_thumbnail_1792575947329.jpg",
    dest: "/Users/fatima/Work/project-one/public/images/episode-53.jpg"
  }
];

for (const { src, dest } of files) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
}
