package com.example.italianrestaurant.table;

import com.example.italianrestaurant.table.reservation.ReservationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;
    private final ModelMapper modelMapper;


    public List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    public Table getTableById(Long id) {
        return tableRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Table saveTable(TableDto table) {
        tableRepository.findByNumber(table.getNumber()).ifPresent(t -> {
            throw new IllegalArgumentException("There already exists a table with number " + table.getNumber());
        });
        Table mappedTable = modelMapper.map(table, Table.class);
        return tableRepository.save(mappedTable);
    }

    public Table updateTable(TableDto table, Long id) {
        Table existingTable = tableRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        tableRepository.findByNumber(table.getNumber()).ifPresent(t -> {
            if (!t.getId().equals(id)) {
                throw new IllegalArgumentException("There already exists a table with number " + table.getNumber());
            }
        });
        Table mappedTable = modelMapper.map(table, Table.class);
        mappedTable.setId(existingTable.getId());
        return tableRepository.save(mappedTable);
    }

    public void deleteTable(Long id) {
        tableRepository.deleteById(id);
    }
}
