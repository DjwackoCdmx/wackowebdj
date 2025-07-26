// Archivo de tipos personalizado para React con comentarios traducidos al español
// Copia de index.d.ts modificado para versionar y mantener cambios

// Tipos y comentarios de React Hooks traducidos al español
// Archivo versionable para uso en el proyecto

declare namespace ReactCustomES {
    /**
     * Devuelve un valor con estado y una función para actualizarlo.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useState}
     */
    function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
    /**
     * Devuelve un valor con estado y una función para actualizarlo.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useState}
     */
    function useState<S = undefined>(): [S | undefined, (value: S | ((prevState: S | undefined) => S | undefined)) => void];

    /**
     * Una alternativa a `useState`.
     *
     * `useReducer` suele ser preferible a `useState` cuando tienes lógica de estado compleja que involucra
     * múltiples sub-valores. También permite optimizar el rendimiento para componentes que disparan actualizaciones profundas
     * porque puedes pasar `dispatch` en vez de callbacks.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A, I>(
        reducer: (prevState: S) => S,
        initializerArg: I,
        initializer: (arg: I) => S
    ): [S, () => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S>(
        reducer: (prevState: S) => S,
        initializerArg: S,
        initializer?: undefined
    ): [S, () => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A, I>(
        reducer: (prevState: S, action: A) => S,
        initializerArg: I & S,
        initializer: (arg: I & S) => S
    ): [S, (value: A) => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A, I>(
        reducer: (prevState: S, action: A) => S,
        initializerArg: I,
        initializer: (arg: I) => S
    ): [S, (value: A) => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A>(
        reducer: (prevState: S, action: A) => S,
        initialState: S,
        initializer?: undefined
    ): [S, (value: A) => void];

    /**
     * `useRef` devuelve un objeto ref mutable cuya propiedad `.current` se inicializa con el argumento pasado
     * (`initialValue`). El objeto retornado persiste durante toda la vida del componente.
     *
     * Ten en cuenta que `useRef()` es útil para más que el atributo `ref`. Es útil para mantener cualquier valor mutable
     * similar a cómo usarías campos de instancia en clases.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useRef}
     */
    function useRef<T>(initialValue: T): { current: T };
    function useRef<T = undefined>(initialValue?: undefined): { current: T | undefined };

    /**
     * La firma es idéntica a `useEffect`, pero se ejecuta de forma síncrona después de todas las mutaciones del DOM.
     * Úsalo para leer el layout del DOM y volver a renderizar de forma síncrona. Las actualizaciones programadas dentro de
     * `useLayoutEffect` se ejecutarán de forma síncrona, antes de que el navegador pinte.
     *
     * Prefiere el estándar `useEffect` cuando sea posible para evitar bloquear actualizaciones visuales.
     *
     * Si migras código desde un componente de clase, `useLayoutEffect` se dispara en la misma fase que
     * `componentDidMount` y `componentDidUpdate`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useLayoutEffect}
     */
    function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;

    /**
     * Acepta una función que contiene código imperativo, posiblemente con efectos.
     *
     * @param effect Función imperativa que puede retornar una función de limpieza
     * @param deps Si está presente, el efecto solo se activará si los valores de la lista cambian.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useEffect}
     */
    function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;

    /**
     * Personaliza el valor de instancia que se expone a los componentes padre cuando se usa `ref`.
     * Como siempre, el código imperativo usando refs debe evitarse en la mayoría de los casos.
     *
     * `useImperativeHandle` debe usarse con `React.forwardRef`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useImperativeHandle}
     */
    function useImperativeHandle<T, R extends T>(ref: { current: T } | undefined, init: () => R, deps?: readonly unknown[]): void;

    /**
     * Devuelve una versión diferida del valor que puede "rezagarse".
     *
     * Esto se usa comúnmente para mantener la interfaz receptiva cuando tienes algo que se renderiza inmediatamente
     * según la entrada del usuario y algo que necesita esperar por una consulta de datos.
     *
     * @param value El valor que será diferido
     *
     * @ver {@link https://react.dev/reference/react/useDeferredValue}
     */
    function useDeferredValue<T>(value: T): T;

    /**
     * Permite a los componentes evitar estados de carga indeseables esperando a que el contenido se cargue
     * antes de hacer la transición a la siguiente pantalla. También permite diferir actualizaciones de datos más lentas
     * hasta renderizados posteriores para que las actualizaciones más cruciales se rendericen inmediatamente.
     *
     * El hook `useTransition` retorna dos valores en un array.
     *
     * El primero es un booleano, la forma de React de informarnos si estamos esperando que la transición termine.
     * El segundo es una función que toma un callback. Podemos usarla para decirle a React qué estado queremos diferir.
     *
     * @ver {@link https://react.dev/reference/react/useTransition}
     */
    function useTransition(): [boolean, (callback: () => void) => void];

    /**
     * Similar a `useTransition` pero permite usos donde los hooks no están disponibles.
     *
     * @param callback Una función _sincrónica_ que causa actualizaciones de estado que pueden diferirse.
     */
    function startTransition(scope: () => void): void;

    /**
     * Envuelve cualquier código que renderice y dispare actualizaciones a tus componentes dentro de llamadas a `act()`.
     *
     * Asegura que el comportamiento en tus pruebas coincida más con lo que sucede en el navegador
     * ejecutando los `useEffect` pendientes antes de retornar. Esto también reduce la cantidad de re-renderizados realizados.
     *
     * @param callback Un callback sincrónico y void que se ejecutará como un solo commit completo de React.
     *
     * @ver https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks
     */
    function act(callback: () => void): void;
    function act<T>(callback: () => T | Promise<T>): Promise<T>;

    /**
     * Devuelve un id único para el componente.
     */
    function useId(): string;

    /**
     * Permite mostrar una etiqueta para hooks personalizados en React DevTools.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useDebugValue}
     */
    function useDebugValue<T>(value: T, format?: (value: T) => unknown): void;

    /**
     * Representa el tipo de un componente de clase en React.
     *
     * @template P Las props que acepta el componente.
     * @template S El estado interno del componente.
     * @see {@link https://legacy.reactjs.org/docs/react-component.html}
     */
    interface ComponentClass<P = object, S = object> {
        new(
            props: P,
            deprecatedLegacyContext?: unknown,
        ): Component<P, S>;
        /**
         * Usado en mensajes de depuración. Puedes establecerlo explícitamente si quieres mostrar un nombre diferente para depuración.
         *
         * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname}
         */
        displayName?: string | undefined;
    }

    /**
     * Representa la clase base para componentes de React escritos en JavaScript plano.
     *
     * @template P Las props que acepta el componente.
     * @template S El estado interno del componente.
     */
    class Component<P = object, S = object> {
        constructor(props: P);
        // ...otros métodos y propiedades de ciclo de vida...
    }

    /**
     * Representa un componente de clase que implementa una comparación superficial de props y estado.
     *
     * @template P Las props que acepta el componente.
     * @template S El estado interno del componente.
     */
    class PureComponent<P = object, S = object> extends Component<P, S> {}
}

declare namespace React {
    // ...existing code antes de useState...

    /**
     * Devuelve un valor con estado y una función para actualizarlo.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useState}
     */
    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    /**
     * Devuelve un valor con estado y una función para actualizarlo.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useState}
     */
    function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
    /**
     * Una alternativa a `useState`.
     *
     * `useReducer` suele ser preferible a `useState` cuando tienes lógica de estado compleja que involucra
     * múltiples sub-valores. También permite optimizar el rendimiento para componentes que disparan actualizaciones profundas
     * porque puedes pasar `dispatch` en vez de callbacks.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A, I>(
        reducer: (prevState: S) => S,
        initializerArg: I,
        initializer: (arg: I) => S
    ): [S, () => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S>(
        reducer: (prevState: S) => S,
        initializerArg: S,
        initializer?: undefined
    ): [S, () => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A, I>(
        reducer: (prevState: S, action: A) => S,
        initializerArg: I & S,
        initializer: (arg: I & S) => S
    ): [S, (value: A) => void];
    /**
     * Una alternativa a `useState`.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A, I>(
        reducer: (prevState: S, action: A) => S,
        initializerArg: I,
        initializer: (arg: I) => S
    ): [S, (value: A) => void];
    /**
     * Una alternativa a `useState`.
     *
     * `useReducer` suele ser preferible a `useState` cuando tienes lógica de estado compleja que involucra
     * múltiples sub-valores. También permite optimizar el rendimiento para componentes que disparan actualizaciones profundas
     * porque puedes pasar `dispatch` en vez de callbacks.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useReducer}
     */
    function useReducer<S, A>(
        reducer: (prevState: S, action: A) => S,
        initialState: S,
        initializer?: undefined
    ): [S, (value: A) => void];

    /**
     * `useRef` devuelve un objeto ref mutable cuya propiedad `.current` se inicializa con el argumento pasado
     * (`initialValue`). El objeto retornado persiste durante toda la vida del componente.
     *
     * Ten en cuenta que `useRef()` es útil para más que el atributo `ref`. Es útil para mantener cualquier valor mutable
     * similar a cómo usarías campos de instancia en clases.
     *
     * @versión 16.8.0
     * @ver {@link https://react.dev/reference/react/useRef}
     */
    function useRef<T>(initialValue: T): MutableRefObject<T>;
    // ...existing code después de useRef...
}
// ...existing code después del namespace React...
