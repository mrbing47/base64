# Installation

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/mrbing47/base64/master/install)

```

# Update

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/mrbing47/base64/master/install) update

```

# Usage

In order to encode a string

```bash
$> b64 encode "hello"
aGVsbG8=
```

In order to decode a message

```bash
$> b64 decode "aGVsbG8="
hello
```
