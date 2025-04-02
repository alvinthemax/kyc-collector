export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { title, steps } = req.body;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "alvinthemax";  // Ganti dengan username GitHub kamu
  const REPO_NAME = "kyc-collector";  // Ganti dengan nama repositori
  const FILE_PATH = "data.json";  // Path file JSON di repo

  const data = { title, steps };
  const jsonContent = JSON.stringify(data, null, 2);

  try {
    // Ambil SHA file lama
    const existingFile = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );
    const existingData = await existingFile.json();
    const sha = existingData.sha; // SHA file lama

    // Simpan JSON ke GitHub
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update JSON data",
          content: Buffer.from(jsonContent).toString("base64"),
          sha, // SHA dibutuhkan jika file sudah ada
        }),
      }
    );

    if (response.ok) {
      return res.status(200).json({ message: "Data saved to GitHub" });
    } else {
      return res.status(500).json({ error: "Failed to save data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
