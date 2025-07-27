
const { spawn } = require('child_process');
const path = require('path');

console.log('📦 Installing dependencies for Join Nexora...\n');

// Install frontend dependencies
console.log('Installing frontend dependencies...');
const frontend = spawn('npm', ['install'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

frontend.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Frontend dependencies installed successfully\n');
    
    // Install backend dependencies
    console.log('Installing backend dependencies...');
    const backend = spawn('npm', ['install'], {
      cwd: path.join(__dirname, '../backend'),
      stdio: 'inherit',
      shell: true
    });
    
    backend.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend dependencies installed successfully\n');
        console.log('🎉 All dependencies installed! You can now run "npm run dev:fullstack" to start both servers.');
      } else {
        console.log('❌ Backend dependency installation failed');
      }
    });
  } else {
    console.log('❌ Frontend dependency installation failed');
  }
});
