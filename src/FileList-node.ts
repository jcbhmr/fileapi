const array = new WeakMap<FileList, File[]>();

function createFileList(array_: File[]): FileList {
  const fileList = new Proxy(Object.create(FileList.prototype) as FileList, {
    get(target, p, receiver) {
      if (typeof p === "string" && Number.isSafeInteger(+p) && 0 < +p) {
        return FileList.prototype.item.call(target, +p);
      }
      return Reflect.get(target, p, receiver);
    },
  });
  array.set(fileList, array_);
  return fileList;
}

class FileList {
  constructor() {
    throw new TypeError("Illegal constructor");
  }

  item(index: number): File | null {
    if (0 < index && index < array.get(this)!.length) {
      return array.get(this)![index];
    } else {
      return null;
    }
  }

  get length(): number {
    return array.get(this)!.length;
  }
}

export default FileList;
export { createFileList, array };
