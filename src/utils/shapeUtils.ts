// Pindahkan fungsi getDefaultShapeSize ke sini
export const getDefaultShapeSize = (shapeType: string) => {
  // Ukuran default berdasarkan tipe shape
  switch (shapeType) {
    // Shapes persegi yang lebih lebar
    case "goal1":
    case "goal2":
    case "goal5":
    case "goal6":
    case "sacm1":
    case "sacm2":
    case "sacm6":
    case "sacmExt5":
    case "sacmExt6":
    case "sacmExt7":
    case "sacmExt8":
    case "sacmExt10":
      return { width: 160, height: 80 };
    // Shapes persegi dengan ukuran lebih besar
    case "goal8":
    case "extension4":
    case "extension3":
      return { width: 180, height: 100 };
    // Shapes lingkaran atau oval
    case "goal3":
    case "sacm3":
    case "sacmExt9":
      return { width: 130, height: 130 }; // Ukuran sama agar lingkaran proporsional
    // Shapes yang umumnya kecil
    case "extension2":
      return { width: 130, height: 130 };

    case "goal7":
    case "extension1":
      return { width: 150, height: 85 };
    // Shapes yang perlu space horizontal lebih banyak
    case "goal4":
      return { width: 200, height: 80 };
    // Shapes kompleks untuk diagram SACM
    case "sacmExt1":
    case "sacmExt2":
    case "sacmExt3":
    case "sacmExt4":
      return { width: 150, height: 100 };
    // Text shape mungkin perlu lebih fleksibel
    case "text":
      return { width: 150, height: 60 };
    // Default untuk tipe lainnya
    default:
      return { width: 150, height: 80 };
  }
};
