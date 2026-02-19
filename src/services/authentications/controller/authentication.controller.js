import authenticationRepositories from "../repositories/authentication.repositories.js";
import usersRepositories from "../../users/repositories/users.repositories.js";
import TokenManager from "../../../security/token-manager.js";
import response from "../../../utils/response.js";
import InvariantError from "../../../exceptions/invariant-error.js";
import AuthenticationError from "../../../exceptions/authentication-error.js";

export const Login = async (req, res, next) => {
  const { username, password } = req.validated;
  const user = await usersRepositories.verifyUserCredential(username, password);

  if (!user) {
    return next(new AuthenticationError("Kredensial yang anda berikan salah"));
  }

  const accessToken = TokenManager.generateAccessToken({ id: user.id });
  const refreshToken = TokenManager.generateRefreshToken({ id: user.id });

  await authenticationRepositories.addRefreshToken(refreshToken);

  return response(res, 201, "Login berhasil", {
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.validated;

  const result =
    await authenticationRepositories.verifyRefreshToken(refreshToken);

  if (!result) {
    return next(new InvariantError("Refresh token tidak valid"));
  }

  const { id } = TokenManager.verifyRefreshToken(refreshToken);
  const accessToken = TokenManager.generateAccessToken({ id });

  return response(res, 200, "Access Token berhasil diperbarui", {
    accessToken,
  });
};

export const Logout = async (req, res, next) => {
  const { refreshToken } = req.validated;

  const result =
    await authenticationRepositories.verifyRefreshToken(refreshToken);

  if (!result) {
    return next(new InvariantError("Refresh token tidak valid"));
  }

  await authenticationRepositories.deleteRefreshToken(refreshToken);

  return response(res, 200, "Refresh token berhasil dihapus");
};
