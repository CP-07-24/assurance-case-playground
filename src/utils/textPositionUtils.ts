// Fungsi utilitas untuk menentukan posisi ideal main text dan id text berdasarkan tipe dan ukuran shape
export const getTextPositionsForShape = (
  shapeType: string,
  width: number,
  height: number
): {
  mainTextX: number;
  mainTextY: number;
  idTextX: number;
  idTextY: number;
  mainTextWidth?: number;
  mainTextOffsetX?: number;
} => {
  switch (shapeType) {
    case "sacm3":
    case "sacmExt9":
      return {
        mainTextX: width / 2.4,
        mainTextY: height / 4,
        idTextX: width / 7,
        idTextY: height * 0.17,
      };

    case "solution":
      return {
        mainTextX: width / 2,
        mainTextY: height / 4,
        idTextX: width / 6,
        idTextY: height * 0.17,
      };
    case "strategy": // Persegi panjang lebar
      return {
        mainTextX: width / 2,
        mainTextY: height * 0.38,
        idTextX: width * 0.2,
        idTextY: height * 0.18,
      };
    case "goal":
    case "context":
    case "sacm1":
    case "sacm6":
    case "sacmExt5":
    case "sacmExt6":
    case "sacmExt7":
    case "sacmExt8":
    case "sacmExt10":
      return {
        mainTextX: width / 2,
        mainTextY: height * 0.3,
        idTextX: width * 0.05,
        idTextY: height * 0.1,
      };
    case "assumption":
    case "justification":
      return {
        mainTextX: width / 2,
        mainTextY: height * 0.3,
        idTextX: width * 0.13,
        idTextY: height * 0.18,
      };
    case "sacm2":
      return {
        mainTextX: width / 1.03,
        mainTextY: height * 0.5,
        idTextX: width * 0.55,
        idTextY: height * 0.15,
      };
    case "goal8":
    case "extension4":
    case "extension3":
      return {
        mainTextX: width / 2,
        mainTextY: height * 0.2,
        idTextX: width * 0.09,
        idTextY: height * 0.12,
      };
    case "goal7": // Kotak kecil
    case "extension1":
      return {
        mainTextX: width / 2,
        mainTextY: height / 2,
        idTextX: width * 0.18,
        idTextY: height * 0.18,
      };
    case "extension2":
      return {
        mainTextX: width / 2,
        mainTextY: height / 3.8,
        idTextX: width * 0.18,
        idTextY: height * 0.18,
      };
    case "sacmExt2":
    case "sacmExt3":
    case "sacmExt4":
      return {
        mainTextX: width * 0.4, // Mulai dari 5% lebar shape (margin kiri)
        mainTextY: height * 0.4,
        idTextX: width * 0.1,
        idTextY: height * 0.13,
        mainTextWidth: width * 0.65, // Hanya 65% lebar shape (area utama)
        mainTextOffsetX: 0, // Tidak perlu offset, biar align center di area utama
      };
    case "sacmExt1":
      return {
        mainTextX: width * 0.5, // Mulai dari 5% lebar shape (margin kiri)
        mainTextY: height * 0.4,
        idTextX: width * 0.05,
        idTextY: height * 0.1,
        mainTextWidth: width * 0.65, // Hanya 65% lebar shape (area utama)
        mainTextOffsetX: 0, // Tidak perlu offset, biar align center di area utama
      };
    case "text":
      return {
        mainTextX: width / 2,
        mainTextY: height / 2,
        idTextX: width / 2,
        idTextY: height * 0.18,
      };
    default:
      return {
        mainTextX: width / 2,
        mainTextY: height * 0.55,
        idTextX: width * 0.13,
        idTextY: height * 0.18,
      };
  }
};
