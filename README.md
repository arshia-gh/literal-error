# literal-error
Create strongly typed errors with ease

# Documentation
Although not necessary, before using `literal-error` we strongly suggest you to convert your errors to constant objects as demonstrated in below code:
```ts
const NotAllowed = {
  name: 'NotAllowed'
  message: 'You are not allowed to perform this action'
  action: 'write:users'
} as const
```

Start with wrapping your function definition with `throws` and pass any error that might be thrown from this function
```ts
import { throws } from 'literal-error'

const writeUser = () => {
  /// implementation
}

const unsafeWriteUser = throws(writeUser, NotAllowed)
```

You can call the unsafe function by using `Try` function as demonstrated in below code:
```ts
import { Try } from 'literal-error'

const result = Try(
  unsafeWriteUser(),
)
```

However the previous code will result in a compile error as previously marked error is not handled, to handle errors you can use the 'Catch' function to catch and handle any possible errors as such:
```ts
const result = Try(
  unsafeWriteUser(),
  Catch(NotAllowed, () => {
    /// implementation
  },
) // result is either the return value of your function or catch handle function
```

