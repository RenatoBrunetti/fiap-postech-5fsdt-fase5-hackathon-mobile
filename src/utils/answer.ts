export default {
  getMappedAnswer: (num: number) => {
    switch (num) {
      case 1:
        return "Muito Difícil\nNão entendi";
      case 2:
        return "Difícil\nEntendi pouco";
      case 3:
        return "Médio\nMais ou menos";
      case 4:
        return "Fácil\nEntendi bem";
      case 5:
        return "Muito Fácil\nEntendi tudo!";
      default:
        return "";
    }
  },
};
