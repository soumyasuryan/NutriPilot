const getDatabaseConfig = () => {
  const rawConnectionString = process.env.DATABASE_URL;

  if (!rawConnectionString) {
    return {
      connectionString: rawConnectionString,
      ssl: { rejectUnauthorized: false },
    };
  }

  try {
    const parsed = new URL(rawConnectionString);

    if (parsed.searchParams.get('sslmode')) {
      parsed.searchParams.delete('sslmode');
    }

    return {
      connectionString: parsed.toString(),
      ssl: { rejectUnauthorized: false },
    };
  } catch {
    return {
      connectionString: rawConnectionString,
      ssl: { rejectUnauthorized: false },
    };
  }
};

module.exports = { getDatabaseConfig };
