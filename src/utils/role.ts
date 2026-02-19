export default {
  formatRoleName(roleName: string) {
    switch (roleName.toLowerCase()) {
      case "student":
        return "Aluno";
      case "teacher":
        return "Professor";
      default:
        return roleName;
    }
  },
};
