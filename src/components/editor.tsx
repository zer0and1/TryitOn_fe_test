import { useAppStore } from "@/store";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  CloudArrowDownIcon,
  InboxStackIcon,
  NoSymbolIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import { useState, useRef, Fragment, useEffect } from "react";
import { Layer, Stage, Line, Rect, Circle } from "react-konva";
import URLImage from "./URLImage";
import ShapeSelect from "./shapeSelect";
import Konva from "konva";

export default function Editor() {
  const { isModalOpen, openModal, modalType, getSelectedPhotoUrl, getSelectedPhotoRequest, updatePhoto, updateRequest } =
    useAppStore();
  const [tool, setTool] = useState("eraser");
  const [brushRadius, setBrushRadius] = useState(20);
  const [brushColor, setBrushColor] = useState("#FF0000");
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const requestRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      setTool("eraser");
      setLines([]);
    }
  }, [isModalOpen]);

  const handleMouseDown = (e: any) => {
    if(modalType == "request")
      return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      { tool, brushRadius, brushColor, points: [pos.x, pos.y, pos.x, pos.y] },
    ]);
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current || tool == "star") {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleSave = () => {
    if (stageRef.current == null) {
      openModal(false, modalType);
      return;
    }
    
    if(modalType === "edit") {
      const url = stageRef.current.toDataURL();
      updatePhoto(url);
      toast.success("Photo Updated");
    } else {
      const desc = requestRef?.current?.value;
      updateRequest(desc ? desc : "");
      toast.success("Update Requested");
    }
    openModal(false, modalType);
  };

  const handleUndo = () => {
    const newLines = [...lines];
    newLines.splice(-1, 1);
    setLines(newLines);
  };

  const handleReset = () => {
    setLines([]);
  };

  const handleDownload = () => {
    if (downloadRef.current == null || stageRef.current == null) return;
    downloadRef.current.href = stageRef.current.toDataURL();
    downloadRef.current.click();
  };

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={(isOpen) => openModal(isOpen, modalType)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div>
                  <div className="text-center">
                    <Dialog.Title
                      as="h3"
                      className="flex items-center justify-start space-x-2 text-base font-semibold leading-6 text-gray-900"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <PhotoIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <span>Photo Editor</span>
                    </Dialog.Title>
                    {
                      modalType === "request" ? 
                      <div className="mt-1 flex justify-center">
                        <input
                          type="text"
                          ref={requestRef}
                          defaultValue={getSelectedPhotoRequest()}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="your description"
                        />
                      </div> : 
                      <div className="mt-1 flex flex-wrap justify-center">
                        <button
                          type="button"
                          className="m-1 inline-flex justify-center space-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={handleUndo}
                        >
                          <ArrowUturnLeftIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          <span>Undo</span>
                        </button>
                        <button
                          type="button"
                          className="m-1 inline-flex justify-center space-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={handleReset}
                        >
                          <ArrowPathIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          <span>Reset</span>
                        </button>
                        <ShapeSelect setTool={setTool} />
                        <input
                          type="number"
                          className="m-1 block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:mt-0 sm:text-sm sm:leading-6"
                          value={brushRadius}
                          onChange={(e) => {
                            setBrushRadius(parseInt(e.target.value));
                          }}
                        />
                        <input
                          className="m-1 h-9 w-20 px-1 sm:mt-0"
                          type="color"
                          value={brushColor}
                          onChange={(e) => {
                            setBrushColor(e.target.value);
                            console.log(e.target.value);
                          }}
                        />
                        <button
                          type="button"
                          className="m-1 inline-flex justify-center space-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={handleDownload}
                        >
                          <CloudArrowDownIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          <span>Download</span>
                          <a
                            download
                            ref={downloadRef}
                            href=""
                            className="hidden"
                          ></a>
                        </button>
                      </div>
                    }
                    
                    <div className="mt-2 flex justify-center">
                      <Stage
                        width={800}
                        height={600}
                        ref={stageRef}
                        onMouseDown={handleMouseDown}
                        onMousemove={handleMouseMove}
                        onMouseup={handleMouseUp}
                      >
                        <Layer>
                          <URLImage src={getSelectedPhotoUrl()} />
                          {lines.map((line, i) => {
                            if (line.tool === "rect") {
                              return (
                                <Rect
                                  key={i}
                                  x={line.points[0] - line.brushRadius / 2}
                                  y={line.points[1] - line.brushRadius / 2}
                                  width={line.brushRadius}
                                  height={line.brushRadius}
                                  fill={line.brushColor}
                                />
                              );
                            }
                            if (line.tool === "circle") {
                              return (
                                <Circle
                                  key={i}
                                  x={line.points[0]}
                                  y={line.points[1]}
                                  radius={line.brushRadius / 2}
                                  fill={line.brushColor}
                                />
                              );
                            }

                            return (
                              <Line
                                key={i}
                                points={line.points}
                                stroke={line.brushColor}
                                strokeWidth={line.brushRadius}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={
                                  line.tool === "eraser"
                                    ? "destination-out"
                                    : "source-over"
                                }
                              />
                            );
                          })}
                        </Layer>
                      </Stage>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-5 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center space-x-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                    onClick={handleSave}
                  >
                    <InboxStackIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center space-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => openModal(false, modalType)}
                  >
                    <NoSymbolIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Cancel</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
