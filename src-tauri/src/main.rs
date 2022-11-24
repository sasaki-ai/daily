#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};

//让前端调用的命令
#[tauri::command]
//打开主窗口
async fn open_main(handle: tauri::AppHandle) {
    tauri::WindowBuilder::new(&handle, "main", tauri::WindowUrl::App("/home".into()))
        .inner_size(800.0, 600.0)
        .title("日常")
        .center()
        .decorations(false)
        .build()
        .unwrap();
}

#[tauri::command]
async fn open_admin(handle: tauri::AppHandle) {
    tauri::WindowBuilder::new(&handle, "admin", tauri::WindowUrl::App("/admin".into()))
        .inner_size(800.0, 600.0)
        .title("控制面板")
        .center()
        .decorations(false)
        .build()
        .unwrap();
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("open") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("login").unwrap().show().unwrap();
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a left click");
            }
            SystemTrayEvent::RightClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.windows();
                for (key, value) in &window {
                    match value.is_visible() {
                        Ok(f) => match f {
                            true => value.hide().unwrap(),
                            false => value.show().unwrap(),
                        },
                        Err(e) => panic!("{}", e),
                    }
                }
                // let window= app.get_window("main").unwrap();
                // match window.is_visible() {
                //     Ok(f) => match f {
                //         true => window.hide().unwrap(),
                //         false => window.show().unwrap()
                //     },
                //     Err(e) => panic!("{}",e)
                // }
                println!("system tray received a double click");
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            open_main,
            open_admin,
            close_splashscreen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
