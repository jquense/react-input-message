# react-input-message

A small, completely unopinionated way, to display messages next to inputs based on events.
Helpful for displaying input validation messages.

There is a frustrating trend in javascript form validation solutions that couple the view concerns of a form
(hiding/showing of messages) with some specific data layer model, or abstraction.
This often means that in order to use a form validator you also need to use a specific js schema validator,
or are tied into using a specific validation library. `react-input-message` strives to
provide _just_ a solution to quickly and easily annotating form controls without requiring that you use a
specific validation or data schema library.

## Install

```sh
npm i -S react-input-message
```

## Use

You render your inputs as you normally would, except that you wrap them inside a `MessageTrigger`
component which will watch its child input for events.

```js
render(){
  var messages = {
    name: ['name is required']
  }

  return (
    <MessageContainer
      messages={messages}
      onValidationNeeded={handleValidationRequest}
    >
      <form>
        <div>
          <label>Name</label>
          {/* the `events` prop tells the MessageContainer what
            * events to trigger a `onValidationNeeded` handler for */}
          <MessageTrigger for='name' events={[ 'onChange', 'onBlur']}>
            <input type='text'
              value={this.state.name}
              onChange={handleChange}
            />
          </MessageTrigger>

          {/* A `Message` Component will display field specific
            * messages (as provided by the `messages` prop) */}
          <Message for='name'/>
        </div>

         {/* This `MessageTrigger` will trigger a `onValidationNeeded` event for the entire
           * container, or just a specific group. Notice the lack of a `for` prop. */}
        <MessageTrigger events={['onClick']}>
          <button type='button'>Check</button>
        </MessageTrigger>
      </form>
    </MessageContainer>
  )
```


`react-input-message` exports 3 simple components and a utility class:

### `MessageContainer`

__Props__

#### `onValidationNeeded({ fields: array<string>, type: string, args: ?any })`

A handler that fires for each `MessageTrigger` component with a `for` prop

#### `messages: object`

A hash of unique names (`for` prop values) and either a string, or an array of strings.

#### `passthrough: bool`

Allow a nested Container to receive the messages of a parent container.

#### `mapNames(names : array<string>) -> array<string>`

A mapping operation on the inner container names, to the outer container.

#### `mapMessages(messages: object) -> object`

A mapping operation on the outer container messages, to the inner container messages.

### `MessageTrigger`

A MessageTrigger is a component that listens to its child for events and triggers a
validation event in the containing `MessageContainer`. Generally this will be an input component.


#### `for: string | array<string`

A unique name or array of names. The `for` prop uniquely identifies what `onValidationNeeded`
is being triggered _for_. `for` values should map to possible `messages` keys

#### `group: string | array<string | '@all'`

An arbitrary group name that allows inputs to be triggered together. If a `for` prop is specified then
the `group` prop identifies the trigger as a member of that group. If the `for` prop is
excluded then the `group` prop identifies which group to trigger validation for, use the special value `'@all'`
to trigger validation for every known name.

#### `inject(child: ReactElement, messages: object) -> object`

A function that is passed the child, `active` boolean. returns an object of props to add to the child.

```js
function inject(child, isActive){
  return {
    className: classnames(child.props.className, {
      'message-error': isActive
    })
  }
}

<MessageTrigger inject={inject}/>
```

#### `events: string | array<string>` default: `'onChange'`

An array of prop handlers that the MessageTrigger will list on,
and trigger a `onValidationNeeded` event in the Container

Leaving the `for` prop `undefined` is a good way to create buttons that can trigger validation for a
group (or the entire container), but will not be the subject of a validation itself.

#### `Message`

Displays the actual messages for a field, the default implementation just concats the messages together with `, `
but you can easily create custom Message components with the `connectToMessageContainer()` helper

#### `connectToMessageContainer(componentClass, options: object) -> MessageListener`

A higher order component that wraps the passed in `componentClass` and injects
container statue as props:

```
Options {
  methods: array<string>, // methods to passthrough
  resolveNames: (
    props:object,
    container: messageContainerContext
  ) -> array<string>,

  mapMessages: (
    messages: object,
    names: array<string>,
    props:object,
    container: messageContainerContext
  ) -> object,
}
```

### `new Validator(validationFn: (name: string, context: ?any) -> bool)`

A very simple basic form validator class, to help manage input error state, use is completely optional.
It is designed to nicely hook up to the `MessageContainer` component without being tightly coupled to it.

#### `validate(names: array<string>, ...context: ?any) -> Promise<bool>`

Returns a promise that resolves with the valid state of the field.
You can validate multiple fields by passing an array. You can also pass in a `context` object which will be passed to the `validationFn`

#### `validator.isValid(names: array<string>) -> bool`

Checks if a name is currently in an error state

#### `errors(names: array<string>) -> object`

Returns a hash of errors for a set of names;
you can pass this object directly to a `MessageContainer` messages prop

```js
let model = { name: '' }

// you instantiate the object with a function that determines if a field is valid or not
let validator = new Validator(function(fieldName, context){
  let isValid = !!context.model[fieldName]

  if (isValid === false)
    return [ fieldName + ': is required!']
})

validator.validate('fieldName', { model: model })
  .then(function(isValid){
    //do something
  })

validator.isValid('fieldName')
```
