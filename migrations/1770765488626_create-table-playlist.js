/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("playlist", {
    id: {
      type: "VARCHAR(50)",
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      references: "playlist(id)",
      onDelete: "CASCADE",
    },
    song_id: {
      type: "VARCHAR(50)",
      references: "songs(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("playlist_songs", "unique_playlist_song", {
    unique: ["playlist_id", "song_id"],
  });

  pgm.createTable("playlist_song_activities", {
    id: {
      type: "VARCHAR(50)",
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      references: "playlist(id)",
      onDelete: "CASCADE",
    },
    song_id: {
      type: "VARCHAR(50)",
      references: "songs(id)",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "VARCHAR(50)",
      references: "users(id)",
      onDelete: "CASCADE",
    },
    action: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    time: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });

  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(50)",
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      references: "playlist(id)",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "VARCHAR(50)",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("collaborations", "unique_playlist_collaborator", {
    unique: ["playlist_id", "user_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint("collaborations", "unique_playlist_collaborator");
  pgm.dropConstraint("playlist_songs", "unique_playlist_song");
  pgm.dropTable("collaborations");
  pgm.dropTable("playlist_song_activities");
  pgm.dropTable("playlist_songs");
  pgm.dropTable("playlist");
};
