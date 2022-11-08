#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

//让前端调用的命令
#[tauri::command]
//打开主窗口
async fn open_main(handle: tauri::AppHandle) {
    tauri::WindowBuilder::new(
        &handle,
        "main",
        tauri::WindowUrl::App("/home".into()),
    )
    .inner_size(800.0, 600.0)
    .title("日常")
    .center()
    .build()
    .unwrap();
}

#[tauri::command]
async fn open_admin(handle: tauri::AppHandle) {
    tauri::WindowBuilder::new(
        &handle,
        "admin",
        tauri::WindowUrl::App("/admin".into()),
    )
    .inner_size(800.0, 600.0)
    .title("控制面板")
    .center()
    .build()
    .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_main,open_admin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
