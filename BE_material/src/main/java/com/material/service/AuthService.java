package com.material.service;

import com.material.dto.LoginDTO;
import com.material.dto.RegisterDTO;
import com.material.vo.AuthVO;
import com.material.vo.UserVO;

public interface AuthService {

    AuthVO login(LoginDTO loginDTO);

    AuthVO register(RegisterDTO registerDTO);

    UserVO getCurrentUser();
}
