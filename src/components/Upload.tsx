import { useFiles } from "../context/FileContext";

// Starting point for new visitors (Web Version)
export function Upload() {
  const { files, drag_drop_zone, handleLoadRandomSamples } = useFiles();

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        ref={drag_drop_zone}
        id="drag_drop_zone"
        className="w-[80dvw] h-[50dvh] border-2 border-white border-dashed rounded-2xl flex-col gap-7 flex justify-center items-center"
      >
        {files && (
          <>
            {files.map((file, i) => {
              return (
                <p key={i} className="text-white">
                  {file.name}
                </p>
              );
            })}
          </>
        )}
        {!files && (
          <>
            <h1 className="text-white text-3xl italic text-center px-30">
              Please drop/upload any audio files here to proceed or use the
              sample audio instead.
            </h1>
            <div className="flex gap-5">
              <button className="bg-white px-20 py-2 rounded-full text-2xl">
                Upload
              </button>
              <button
                onClick={handleLoadRandomSamples}
                className="bg-white px-20 py-2 rounded-full text-2xl"
              >
                Use Samples
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
