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

#### `MessageContainer`

__Props__

__`onValidationNeeded`__: a handler that fires for each `MessageTrigger` component with a `for` prop

__`messages`__: a hash of unique names (`for` prop values) and either a string, or an array of strings.


#### `MessageTrigger`

A MessageTrigger is a component that listens to its child for events and triggers a
validation event in the containing `MessageContainer`. Generally this will be an input component.

__props__

__`for`__: a unique name or array of names. The `for` prop uniquely identifies what `onValidationNeeded`
is being triggered _for_. `for` values should map to possible `messages` keys

__`group`__: an arbitrary group name that allows inputs to be triggered together. If a `for` prop is specified then
the `group` prop identifies the trigger as a member of that group. If the `for` prop is
excluded then the `group` prop identifies which group to trigger validation for, use the special value `'@all'`
to trigger validation for every known name.

__`inject`__: a function that is passed the child, `active` boolean. returns an object of props to add to the child.

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

__`events`__: default(['onChange']) an array of prop handlers that the MessageTrigger will list on,
and trigger a `onValidationNeeded` event in the Container

Leaving the `for` prop `undefined` is a good way to create buttons that can trigger validation for a
group (or the entire container), but will not be the subject of a validation itself.

#### `Message`

Displays the actual messages for a field, the default implementation just concats the messages together with `, `
but you can easily create custom Message components with the `connectToMessageContainer()` helper

#### `connectToMessageContainer(componentClass, mapMessages: (messages, props, container) -> object)`

Higher order component that wraps the passed in `componentClass` and injects
container statue as props:

__`messages`__: the container messages.


#### `Validator(validationFn)`

A very simple basic form validator class, to help manage input error state, use is completely optional.
It is designed to nicely hook up to the `MessageContainer` component without being tightly coupled to it.

__`validate(fields, [ context ])`__ returns a promise that resolves with the valid state of the field.
You can validate multiple fields by passing an array. You can also pass in a `context` object which will be passed to the `validationFn`

__`isValid`__: checks if a field is currently in an error state

__`errors([fields])`__: return a hash of errors, you can pass this object directly to a `MessageContainer` messages prop

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
