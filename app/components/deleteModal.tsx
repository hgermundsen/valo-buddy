import { Form } from "@remix-run/react";

import { CancelIcon, TrashIcon } from "./svgs";

interface DeleteModalProps {
  cancelButtonCallback(): void;
  isForStrat?: boolean;
  title: string;
}
export default function DeleteModal(props: DeleteModalProps) {
  // https://tailwindui.com/components/application-ui/overlays/dialogs
  return (
    <div className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full">
          <Form
            method="post"
            className="flex flex-col space-y-2 p-4 w-[480px] lg:w-1/2 bg-neutral-800"
          >
            <input type="hidden" name="isDeleteAction" value="true" />

            <h1 className="text-4xl font-['Druk_Wide_Bold']">
              DELETE {props.isForStrat ? "STRAT" : "VOD"}
            </h1>
            <p>Are you sure you want to delete &quot;{props.title}&quot;?</p>
            <div className="flex space-x-2 w-full">
              <button
                type="button"
                onClick={props.cancelButtonCallback}
                className="flex grow space-x-2 px-4 py-3 font-['Space_Mono'] text-sm text-white bg-gradient-to-r from-red-600 to-neutral-900 from-50% to-50% bg-right-bottom bg-[length:201%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-[230ms] ease-in-out"
              >
                <CancelIcon />
                <span>CANCEL</span>
              </button>
              <button
                type="submit"
                className="h-min flex grow space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
              >
                <TrashIcon />
                <span>DELETE</span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
