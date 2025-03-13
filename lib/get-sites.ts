import { promises as fs } from "fs";
import path from "path";

interface Site {
  id: string;
  name: string;
  description: string;
  details: string;
  latitude: number;
  longitude: number;
  video: string;
  images: string[];
}

export async function getSites(): Promise<Site[]> {
  try {
    // Get all directories under /public/sites
    const sitesDirectory = path.join(process.cwd(), "public/sites");
    const sitesFolders = await fs.readdir(sitesDirectory);
    console.log(sitesFolders);
    // Read each site's desc.json file
    const sites = await Promise.all(
      sitesFolders
        .filter((folder) => folder !== ".DS_Store")
        .map(async (folder, index) => {
          const descPath = path.join(sitesDirectory, folder, "des.json");
          const descContent = await fs.readFile(descPath, "utf-8");
          const siteData = JSON.parse(descContent);

          // Get all images in the folder except vid.mp4
          const folderContents = await fs.readdir(
            path.join(sitesDirectory, folder),
          );
          const imageFiles = folderContents.filter(
            (file) => file.endsWith(".jpg") || file.endsWith(".png"),
          );

          return {
            id: folder,
            name: siteData.name || "Monument " + index,
            description: siteData.description,
            details: siteData.details,
            latitude: 35.54491932642123,
            longitude: 9.074707047696306,
            video: `/sites/${folder}/vid.mp4`,
            images: [`/sites/${folder}/pic.jpg`],
          };
        }),
    );

    return sites;
  } catch (error) {
    console.error("Error reading sites:", error);
    return [];
  }
}

export async function getSiteById(siteId: string): Promise<Site | null> {
  try {
    const sitesDirectory = path.join(process.cwd(), "public/sites");
    const descPath = path.join(sitesDirectory, siteId, "des.json");
    const descContent = await fs.readFile(descPath, "utf-8");
    const siteData = JSON.parse(descContent);

    // Get all images in the folder except vid.mp4
    const folderContents = await fs.readdir(path.join(sitesDirectory, siteId));
    const imageFiles = folderContents.filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png"),
    );

    return {
      id: siteId,
      name: siteData.name || "Monument " + siteId,
      description: siteData.description,
      details: siteData.details,
      latitude: 35.54491932642123,
      longitude: 9.074707047696306,
      video: `/sites/${siteId}/vid.mp4`,
      images: [`/sites/${siteId}/pic.jpg`],
    };
  } catch (error) {
    console.error(`Error reading site ${siteId}:`, error);
    return null;
  }
}
