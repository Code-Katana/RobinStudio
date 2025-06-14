# RobinStudio Text Editor

**RobinStudio** is a lightweight and modern text editor tailored for the Robin programming language. It is built using Electron, React, and Monaco Editor, and designed to work seamlessly with the `rbn` compiler.

---

## Features

- Basic text editing features like file tree, file system manipulation, multi tabs, draggable tabs, etc...
- Integration with the Robin compiler
- Compiler output visualization
- Integration with the Robin LSP

---

## Setup & Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [Git](https://git-scm.com/)
- **[Robin compiler](https://github.com/Code-Katana/robin-compiler) (`rbn`) must be installed and added to your system environment variables**

> **Important:**
> The RobinStudio editor requires the `rbn` compiler to be accessible via the terminal/command line.
> Make sure you have:
>
> 1. Installed the `rbn` compiler
> 2. Added its path to your system’s `PATH` environment variable
>
> You should be able to run `rbn --version` from any terminal window.

---

### Clone the Repository

```bash
git clone https://github.com/Code-Katana/RobinStudio
cd RobinStudio
git checkout dev
```

### Install Dependencies

```bash
npm install
```

---

### Run in Development Mode

```bash
npm run dev
```

---

## Testing the Setup

To verify that the `rbn` compiler is installed correctly:

```bash
rbn --version
```

To get a look at some examples for usage run:

```bash
rbn --help
```

If any of this fails, make sure the binary is installed and its folder is added to your system `PATH`.

---

## Project Structure

```txt
/src
  ├── main          # Electron main process
  ├── preload       # Electron preload script
  ├── renderer      # React UI + Tailwind + Shadcn/ui
  └── shared        # shared type, ipc channels, etc...
```

---

## License

MIT License
