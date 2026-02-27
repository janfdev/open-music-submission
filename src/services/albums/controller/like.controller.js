import LikeRepository from "../repositories/like.repositories.js";
import cacheRepositories from "../repositories/cache.repositories.js";
import response from "../../../utils/response.js";
import ClientError from "../../../exceptions/client-error.js";

export const addLike = async (req, res, next) => {
  try {
    const { id: albumId } = req.params;
    const { id: userId } = req.user;

    await LikeRepository.verifyAlbumExists(albumId);

    const isLiked = await LikeRepository.checkLike(userId, albumId);
    if (isLiked) {
      throw new ClientError("Anda sudah menyukai album ini", 400);
    }

    await LikeRepository.addLike(userId, albumId);

    await cacheRepositories.delete(`likes:${albumId}`);

    return response(res, 201, "Album berhasil disukai");
  } catch (error) {
    next(error);
  }
};

export const deleteLike = async (req, res, next) => {
  try {
    const { id: albumId } = req.params;
    const { id: userId } = req.user;

    await LikeRepository.deleteLike(userId, albumId);

    await cacheRepositories.delete(`likes:${albumId}`);

    return response(res, 200, "Batal menyukai album");
  } catch (error) {
    next(error);
  }
};

export const getLikesCount = async (req, res, next) => {
  try {
    const { id: albumId } = req.params;

    try {
      const likes = await cacheRepositories.get(`likes:${albumId}`);
      return res
        .status(200)
        .header("X-Data-Source", "cache")
        .json({
          status: "success",
          data: {
            likes: parseInt(likes, 10),
          },
        });
    } catch {
      const likes = await LikeRepository.getLikesCount(albumId);

      await cacheRepositories.set(`likes:${albumId}`, likes.toString());

      return res.status(200).json({
        status: "success",
        data: {
          likes,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
