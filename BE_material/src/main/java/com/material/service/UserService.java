package com.material.service;

import com.material.dto.UserCreateDTO;
import com.material.dto.UserFilterDTO;
import com.material.dto.UserUpdateDTO;
import com.material.vo.PageVO;
import com.material.vo.UserVO;

import java.io.IOException;
import java.util.UUID;

public interface UserService {

    PageVO<UserVO> getUsers(UserFilterDTO filterDTO);

    UserVO getUserById(UUID id);

    UserVO createUser(UserCreateDTO createDTO);

    UserVO updateUser(UUID id, UserUpdateDTO updateDTO);

    void deleteUser(UUID id);

    byte[] exportUsersToExcel() throws IOException;
}
