const currentDateTime = () => {
  const date = new Date();
  return {
    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    time: Intl.DateTimeFormat("ru", { hour: "numeric", second: "numeric", minute: "numeric" }).format(date),
  };
};

module.exports = currentDateTime;
