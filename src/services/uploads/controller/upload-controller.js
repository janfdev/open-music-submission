import ClientError from "../../../exceptions/client-error.js";
import response from "../../../utils/response.js";
import albumRepository from "../../albums/repositories/album.repositories.js";

export const uploadCover = async (req, res, next) => {
  if (!req.file) {
    return next(new ClientError("No file uploaded"));
  }

  const { id } = req.params;
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 3000;
  const encodedFilename = encodeURIComponent(req.file.filename);
  const fileLocation = `http://${host}:${port}/uploads/${encodedFilename}`;

  try {
    await albumRepository.updateAlbumCover(id, fileLocation);
    return response(res, 201, "success", "Sampul berhasil diunggah");
  } catch (error) {
    return next(error);
  }
};
