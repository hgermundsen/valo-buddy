import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  AnimatedLoadingSpinner,
  CancelIcon,
  CloseIcon,
  TrashIcon,
} from "~/components/svgs";
import {
  deleteStrat,
  doesStratBelongToUser,
  getStratTitle,
} from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => {
  // TODO: Is this a helpful title?
  return [{ title: "ValoBuddy - Delete Strat" }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  // TODO: Do we need these checks?
  await requireUserId(request);
  getMapNameAndAgentName(params);
  const stratId = params.stratId;
  invariant(stratId, "Strat ID not found");
  // TODO: Sanitize stratId. Even though it's in the URL, it's still user input.

  const dbResponse = await getStratTitle(stratId);
  // TODO: Revisit error handling?
  if (dbResponse === null) {
    throw new Response("Title for strat not found", { status: 404 });
  }
  const title = dbResponse.title;
  return json({ title });
}
export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const stratId = params.stratId;
  invariant(stratId, "Strat ID not found");
  if (!doesStratBelongToUser({ id: stratId, userId })) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }

  // TODO: Error handling?
  // TODO: Optimistic UI?
  await deleteStrat(stratId, userId);

  // It's safe to just include user input in the form of params here. The page
  // we're redirecting to performs input sanitization and validation.
  const stratsPageURL = `/collection/${params.mapName}/${params.agentName}/strats`;
  return redirect(stratsPageURL);
}

export default function DeleteStratModal() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const data = useLoaderData<typeof loader>();

  const isDeletingStrat = navigation.state === "submitting";

  return (
    <div className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full">
          <Form
            method="post"
            className="flex flex-col space-y-4 p-4 w-[480px] lg:w-1/2 bg-neutral-800"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-['Druk_Wide_Bold']">DELETE STRAT</h1>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 border-2 border-neutral-700 bg-gradient-to-r from-red-600 to-neutral-900 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 hover:border-valored-500 focus:bg-valored-400 transition-all duration-200 ease-in-out"
              >
                <CloseIcon />
              </button>
            </div>

            <p>Are you sure you want to delete &quot;{data.title}&quot;?</p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex grow space-x-2 px-4 py-3 font-['Space_Mono'] text-sm text-white bg-gradient-to-r from-red-600 to-neutral-900 from-50% to-50% bg-right-bottom bg-[length:201%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
              >
                <CancelIcon />
                <span>CANCEL</span>
              </button>
              <button
                type="submit"
                disabled={isDeletingStrat}
                className="flex grow space-x-2 px-4 py-3 font-['Space_Mono'] text-sm text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:201%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400disabled:text-white disabled:from-neutral-700 disabled:to-neutral-700 transition-all duration-300 ease-in-out"
              >
                {isDeletingStrat ? <AnimatedLoadingSpinner /> : <TrashIcon />}
                <span>{!isDeletingStrat ? "DELETE" : "DELETING..."}</span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
