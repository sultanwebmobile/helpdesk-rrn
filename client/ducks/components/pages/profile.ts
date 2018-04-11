import i18next from 'i18next';
import { Record } from 'immutable';
import Promise from 'bluebird';
import { Dispatch, Reducer } from 'redux';
import { actions as authDataActions } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';

// Action types
enum ActionTypeProfile {
  SET_OPENED_NAME = 'profile-page/SET_OPENED_NAME',
  TOGGLE_BLOCKED = 'profile-page/TOGGLE_BLOCKED',
  RESET = 'profile-page/RESET',
}

// State
export class State extends Record({ isBlocked: false, openedInlineEditName: '' }) {
  isBlocked: boolean;
  openedInlineEditName: string;
}

/*
* Actions
* */
interface IProfileSetOpenedName {
  readonly type: ActionTypeProfile.SET_OPENED_NAME;
  readonly payload: string;
}
interface IProfileReset {
  readonly type: ActionTypeProfile.RESET;
}
interface IProfileToggleBlocked {
  readonly type: ActionTypeProfile.TOGGLE_BLOCKED;
  readonly payload: boolean;
}

type TActions = IProfileSetOpenedName | IProfileReset | IProfileToggleBlocked;

const profilePageSetOpenedNameDelta = ({ name }: { name: string }): IProfileSetOpenedName =>
  ({ type: ActionTypeProfile.SET_OPENED_NAME, payload: name });
const profilePageToggleBlockedDelta = (state: boolean): IProfileToggleBlocked =>
  ({ type: ActionTypeProfile.TOGGLE_BLOCKED, payload: state });
const profilePageResetDelta = (): IProfileReset => ({ type: ActionTypeProfile.RESET });

/* Signals */
interface IProfileUpdateDispatch<D> {
  (dispatch: Dispatch<D>):
    Promise<{ isSuccess?: boolean, status?: number, data?: object, error?: Error }>;
}
interface IProfileUpdate {
  <T>(options: { data: object }): IProfileUpdateDispatch<T>;
}

// TODO: Mend after authDataUpdateSignal will be described
const profilePageUpdateSignal: IProfileUpdate = ({ data }) => dispatch =>
  Promise.coroutine(function* updateProfile() {
    dispatch(profilePageToggleBlockedDelta(true));

    const answer = yield dispatch(authDataActions.authDataUpdateSignal(data));

    dispatch(profilePageToggleBlockedDelta(false));
    dispatch(profilePageSetOpenedNameDelta({ name: '' }));

    if (answer.isSuccess) {
      dispatch(
        toastsComponentActions.toastsComponentAddDelta({
          type: 'info',
          content: i18next.t('profile_updated'),
        })
      );
    }

    return answer;
  })();

export const actions = {
  profilePageSetOpenedNameDelta,
  profilePageToggleBlockedDelta,
  profilePageResetDelta,
  profilePageUpdateSignal,
};

/*
* Reducer
* */
const initialState = new State();

const reducer: Reducer<State> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeProfile.SET_OPENED_NAME:
      return state.set('openedInlineEditName', action.payload);

    case ActionTypeProfile.TOGGLE_BLOCKED:
      return state.set('isBlocked', action.payload);

    case ActionTypeProfile.RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
