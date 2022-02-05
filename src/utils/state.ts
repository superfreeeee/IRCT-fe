import {
  atom,
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
  selector,
} from 'recoil';

interface StrictAtomOptions<T> {
  key: string;
  default: T;
  interceptors?: InterceptorsObj<T>;
  mutable?: boolean;
  preventDefaultSet?: boolean;
}

interface GetInterceptor<T> {
  ({ get: GetRecoilValue }): RecoilValue<T>;
}

interface SetInterceptor<T> {
  ({ get: GetRecoilValue, set: SetRecoilState }, newValue: T): void;
}

interface InterceptorsObj<T> {
  get: GetInterceptor<T> | GetInterceptor<T>[];
  set: SetInterceptor<T> | SetInterceptor<T>[];
}

type StrictAtom =
  | (<T>(options: StrictAtomOptions<T>) => RecoilState<T>)
  | (<T>(options: StrictAtomOptions<T>) => RecoilValueReadOnly<T>);

export const strictAtom = <T>(options: StrictAtomOptions<T>) => {
  const {
    key,
    default: defaultValue,
    interceptors,
    mutable,
    preventDefaultSet,
  } = options;
  const atomKey = `${key}BaseState`;
  const selectorKey = `${key}State`;

  // atom: base state
  const baseState = atom<T>({
    key: atomKey,
    default: defaultValue,
  });

  const { get, set } = interceptors;
  const getters = Array.isArray(get) ? get : get ? [get] : [];

  const wrappedGet = ({ get }) => {
    return get(baseState);
  };

  // selector: export state
  if (mutable) {
    /**
     * 1. read only
     */
    const state = selector<T>({
      key: selectorKey,
      get: wrappedGet,
    });

    return state;
  } else {
    /**
     * 2. mutable
     */
    // default setters
    const setters = Array.isArray(set) ? set : set ? [set] : [];
    !preventDefaultSet &&
      setters.push(({ set }) => {
        set(baseState);
      });

    const wrappedSet = ({ get, set }, newValue) => {
      setters.forEach((setter) => setter({ get, set }, newValue as T));
    };

    const state = selector<T>({
      key: selectorKey,
      get: wrappedGet,
      set: wrappedSet,
    });
    return state;
  }
};
