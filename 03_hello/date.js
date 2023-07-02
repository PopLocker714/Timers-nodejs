const currentDateTime = () => {
  const date = new Date();
  return {
    date: `${date.getFullYear()}-${date.getMonth() + 1 <= 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`}-${
      date.getDate() + 1 <= 10 ? `0${date.getDate() + 1}` : `${date.getDate() + 1}`
    }`,
    time: Intl.DateTimeFormat("ru", { hour: "numeric", second: "numeric", minute: "numeric" }).format(date),
  };
};

module.exports = currentDateTime;
