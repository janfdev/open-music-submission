import usersRepositories from "../repositories/users.repositories.js";
import response from "../../../utils/response.js";
import InvariantError from "../../../exceptions/invariant-error.js";

export const createUser = async (req, res, next) => {
  const { username, password, fullname } = req.validated;

  const isUsernameExist = await usersRepositories.verifyNewUsername(username);

  if (isUsernameExist) {
    return next(
      new InvariantError("Gagal menambahkan user. Username sudah digunakan"),
    );
  }

  const user = await usersRepositories.createUser({
    username,
    password,
    fullname,
  });

  if (!user) {
    return next(new InvariantError("User gagal ditambahkan"));
  }

  return response(res, 201, "User berhasil ditambahkan", { userId: user.id });
};
